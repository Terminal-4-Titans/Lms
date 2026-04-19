from flask import Blueprint, request, jsonify
from flask_mail import Message
from models import db, Admin, Book, User, Borrow, Query
from datetime import datetime
import random
from extensions import mail


admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')

otp_store = {}

@admin_bp.route('/test', methods=['GET'])
def test_admin():
    return jsonify({
        "success": True,
        "message": "Admin route working"
    })

@admin_bp.route('/register', methods=['POST'])
def register_admin():
    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    existing_admin = Admin.query.filter_by(email=email).first()

    if existing_admin:
        return jsonify({
            "success": False,
            "message": "Admin already exists"
        })

    new_admin = Admin(name=name, email=email, password=password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Admin registered successfully"
    })

@admin_bp.route('/login', methods=['POST'])
def login_admin():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email, password=password).first()

    if not admin:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        })

    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp

    try:
        msg = Message(
            subject="Library Management System Login OTP",
            recipients=[email]
        )
        msg.body = f"Your OTP for Admin Login is: {otp}\n\nDo not share this OTP with anyone."
        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent to your email"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Email sending failed: {str(e)}"
        })

@admin_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()

    email = data.get('email')
    otp = data.get('otp')

    saved_otp = otp_store.get(email)

    if saved_otp == otp:
        otp_store.pop(email, None)
        return jsonify({
            "success": True,
            "message": "OTP verified successfully"
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid OTP"
        })

@admin_bp.route('/login-test', methods=['GET'])
def login_test():
    return jsonify({
        "success": True,
        "message": "Login API exists, but real login must use POST"
    })

@admin_bp.route('/register-test', methods=['GET'])
def register_test():
    return jsonify({
        "success": True,
        "message": "Register API exists, but real register must use POST"
    })

@admin_bp.route('/add-book', methods=['POST'])
def add_book():
    try:
        data = request.get_json()

        title = data.get('title')
        author = data.get('author')
        category = data.get('category')
        year = data.get('year')
        quantity = data.get('quantity')

        new_book = Book(
            title=title,
            author=author,
            category=category,
            year=year,
            quantity=quantity,
            available=quantity
        )

        db.session.add(new_book)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Book added successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/all-books', methods=['GET'])
def get_books():
    try:
        books = Book.query.all()

        book_list = []
        for book in books:
            book_list.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "category": book.category,
                "year": book.year,
                "quantity": book.quantity,
                "available": book.available
            })

        return jsonify({
            "success": True,
            "books": book_list
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@admin_bp.route('/delete-book/<int:id>', methods=['DELETE'])
def delete_book(id):
    try:
        book = Book.query.get(id)

        if not book:
            return jsonify({
                "success": False,
                "message": "Book not found"
            }), 404

        db.session.delete(book)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Book deleted successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@admin_bp.route('/users-list', methods=['GET'])
def users_list():
    try:
        users = User.query.all()

        data = []
        for user in users:
            data.append({
                "id": user.id,
                "name": user.name,
                "email": user.email
            })

        return jsonify({
            "success": True,
            "users": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@admin_bp.route('/books-list', methods=['GET'])
def books_list():
    try:
        books = Book.query.all()

        data = []
        for book in books:
            data.append({
                "id": book.id,
                "title": book.title,
                "available": book.available
            })

        return jsonify({
            "success": True,
            "books": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@admin_bp.route('/issue-book', methods=['POST'])
def issue_book():
    try:
        data = request.get_json()

        user_id = data.get('user_id')
        book_id = data.get('book_id')
        amount = data.get('amount')
        issue_date = data.get('issue_date')
        due_date = data.get('due_date')

        book = Book.query.get(book_id)

        if not book:
            return jsonify({
                "success": False,
                "message": "Book not found"
            }), 404

        if book.available <= 0:
            return jsonify({
                "success": False,
                "message": "Book not available"
            }), 400

        new_issue = Borrow(
            user_id=user_id,
            book_id=book_id,
            amount=amount,
            issue_date=datetime.strptime(issue_date, "%Y-%m-%d").date(),
            due_date=datetime.strptime(due_date, "%Y-%m-%d").date(),
            status="Issued"
        )

        book.available = book.available - 1

        db.session.add(new_issue)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Book issued successfully",
            "issue_id": new_issue.id
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/active-issued-books', methods=['GET'])
def active_issued_books():
    try:
        issued_list = []

        records = Borrow.query.filter_by(status="Issued").all()

        for record in records:
            user = User.query.get(record.user_id)
            book = Book.query.get(record.book_id)

            issued_list.append({
                "id": record.id,
                "user_name": user.name if user else "Unknown User",
                "book_title": book.title if book else "Unknown Book",
                "amount": str(record.amount) if record.amount else "0",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "status": record.status
            })

        return jsonify({
            "success": True,
            "issued_books": issued_list
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@admin_bp.route('/issued-books', methods=['GET'])
def issued_books():
    try:
        issued_list = []

        records = Borrow.query.all()

        for record in records:
            user = User.query.get(record.user_id)
            book = Book.query.get(record.book_id)

            issued_list.append({
                "id": record.id,
                "user_name": user.name if user else "Unknown User",
                "book_title": book.title if book else "Unknown Book",
                "amount": str(record.amount) if record.amount else "0",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "return_date": str(record.return_date) if record.return_date else "",
                "status": record.status,
                "fine": str(record.fine) if record.fine else "0"
            })

        return jsonify({
            "success": True,
            "issued_books": issued_list
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500    

@admin_bp.route('/return-book/<int:id>', methods=['PUT'])
def return_book(id):
    try:
        from datetime import date

        record = Borrow.query.get(id)

        if not record:
            return jsonify({
                "success": False,
                "message": "Issued record not found"
            }), 404

        if record.status == "Returned":
            return jsonify({
                "success": False,
                "message": "Book already returned"
            }), 400

        book = Book.query.get(record.book_id)

        today = date.today()
        record.return_date = today
        record.status = "Returned"

        fine_per_day = 20
        fine = 0

        if today > record.due_date:
            late_days = (today - record.due_date).days
            fine = late_days * fine_per_day

        record.fine = fine

        if book:
            book.available = book.available + 1

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Book returned successfully",
            "fine": fine
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@admin_bp.route('/not-returned-books', methods=['GET'])
def not_returned_books():
    try:
        from datetime import date

        records = Borrow.query.filter_by(status="Issued").all()
        data = []

        for record in records:
            user = User.query.get(record.user_id)
            book = Book.query.get(record.book_id)

            overdue = False
            if record.due_date < date.today():
                overdue = True

            data.append({
                "id": record.id,
                "user_name": user.name if user else "Unknown User",
                "user_email": user.email if user else "Unknown Email",
                "book_title": book.title if book else "Unknown Book",
                "amount": str(record.amount) if record.amount else "0",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "status": record.status,
                "overdue": overdue
            })

        return jsonify({
            "success": True,
            "books": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/reminder-books', methods=['GET'])
def reminder_books():
    try:
        from datetime import date, timedelta

        today = date.today()
        next_two_days = today + timedelta(days=2)

        records = Borrow.query.filter_by(status="Issued").all()
        data = []

        for record in records:
            if today <= record.due_date <= next_two_days:
                user = User.query.get(record.user_id)
                book = Book.query.get(record.book_id)

                data.append({
                    "id": record.id,
                    "user_name": user.name if user else "Unknown User",
                    "user_email": user.email if user else "Unknown Email",
                    "book_title": book.title if book else "Unknown Book",
                    "issue_date": str(record.issue_date),
                    "due_date": str(record.due_date),
                    "amount": str(record.amount) if record.amount else "0",
                    "status": record.status
                })

        return jsonify({
            "success": True,
            "books": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/send-reminder-mails', methods=['POST'])
def send_reminder_mails():
    try:
        from datetime import date, timedelta
        from flask_mail import Message
        from extensions import mail

        today = date.today()
        next_two_days = today + timedelta(days=2)

        records = Borrow.query.filter_by(status="Issued").all()
        sent_count = 0

        for record in records:
            if today <= record.due_date <= next_two_days:
                user = User.query.get(record.user_id)
                book = Book.query.get(record.book_id)

                if user and book:
                    msg = Message(
                        subject="Library Book Due Reminder",
                        recipients=[user.email]
                    )

                    msg.body = f"""
Hello {user.name},

This is a reminder that your borrowed book is due soon.

Book Name: {book.title}
Issue Date: {record.issue_date}
Due Date: {record.due_date}

Please return or renew the book before the due date.

Thank you,
Library Management System
"""
                    mail.send(msg)
                    sent_count += 1

        return jsonify({
            "success": True,
            "message": f"Reminder mails sent successfully to {sent_count} users"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@admin_bp.route('/dashboard-stats', methods=['GET'])
def dashboard_stats():
    try:
        from datetime import date

        total_users = User.query.count()
        total_books = Book.query.count()
        issued_books = Borrow.query.filter_by(status="Issued").count()

        overdue_books = Borrow.query.filter(
            Borrow.status == "Issued",
            Borrow.due_date < date.today()
        ).count()

        total_fine = db.session.query(db.func.sum(Borrow.fine)).scalar() or 0

        return jsonify({
            "success": True,
            "total_users": total_users,
            "total_books": total_books,
            "issued_books": issued_books,
            "overdue_books": overdue_books,
            "total_fine": float(total_fine)
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/all-books-public', methods=['GET'])
def all_books_public():
    try:
        books = Book.query.all()

        data = []
        for book in books:
            data.append({
                "id": book.id,
                "title": book.title,
                "author": book.author,
                "category": book.category,
                "year": book.year,
                "quantity": book.quantity,
                "available": book.available
            })

        return jsonify({
            "success": True,
            "books": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@admin_bp.route('/all-queries', methods=['GET'])
def all_queries():
    try:
        queries = Query.query.all()
        data = []

        for q in queries:
            user = User.query.get(q.user_id)

            data.append({
                "id": q.id,
                 "user_name": user.name if user else "Unknown User",
                 "subject": q.subject,
                 "message": q.message,
                 "status": q.status,
                 "reply": q.reply if q.reply else "",
                 "created_at": str(q.created_at),
                  "replied_at": str(q.replied_at) if q.replied_at else ""
            })

        return jsonify({
            "success": True,
            "queries": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@admin_bp.route('/reply-query/<int:id>', methods=['PUT'])
def reply_query(id):
    try:
        from datetime import datetime

        query = Query.query.get(id)

        if not query:
            return jsonify({
                "success": False,
                "message": "Query not found"
            }), 404

        data = request.get_json()
        reply = data.get("reply")

        query.reply = reply
        query.status = "Replied"
        query.replied_at = datetime.now()

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Reply sent successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/category-analysis', methods=['GET'])
def category_analysis():
    try:
        from sqlalchemy import func
        from models import Borrow, Book

        results = (
            db.session.query(
                Book.category,
                func.count(Borrow.id)
            )
            .join(Borrow, Borrow.book_id == Book.id)
            .group_by(Book.category)
            .all()
        )

        data = []

        for category, count in results:
            data.append({
                "category": category,
                "count": count
            })

        return jsonify({
            "success": True,
            "data": data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/update-book/<int:id>', methods=['PUT'])
def update_book(id):
    try:
        data = request.get_json()

        book = Book.query.get(id)

        if not book:
            return jsonify({
                "success": False,
                "message": "Book not found"
            }), 404

        old_quantity = book.quantity
        old_available = book.available

        book.title = data.get('title')
        book.author = data.get('author')
        book.category = data.get('category')
        book.year = data.get('year')

        new_quantity = int(data.get('quantity'))

        diff = new_quantity - old_quantity
        book.quantity = new_quantity
        book.available = old_available + diff

        if book.available < 0:
            book.available = 0

        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Book updated successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/return-preview/<int:id>', methods=['GET'])
def return_preview(id):
    try:
        from datetime import date

        record = Borrow.query.get(id)

        if not record:
            return jsonify({
                "success": False,
                "message": "Issued record not found"
            }), 404

        user = User.query.get(record.user_id)
        book = Book.query.get(record.book_id)

        today = date.today()
        fine_per_day = 5
        fine = 0

        if today > record.due_date:
            late_days = (today - record.due_date).days
            fine = late_days * fine_per_day

        return jsonify({
            "success": True,
            "data": {
                "id": record.id,
                "user_name": user.name if user else "",
                "book_title": book.title if book else "",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "fine": fine
            }
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@admin_bp.route('/returned-books', methods=['GET'])
def returned_books():
    try:
        records = Borrow.query.filter_by(status="Returned").all()
        data = []

        for record in records:
            user = User.query.get(record.user_id)
            book = Book.query.get(record.book_id)

            data.append({
                "id": record.id,
                "user_name": user.name if user else "Unknown User",
                "user_email": user.email if user else "Unknown Email",
                "book_title": book.title if book else "Unknown Book",
                "amount": str(record.amount) if record.amount else "0",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "return_date": str(record.return_date) if record.return_date else "",
                "fine": str(record.fine) if record.fine else "0",
                "status": record.status
            })

        return jsonify({
            "success": True,
            "books": data
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@admin_bp.route('/send-overdue-mails', methods=['POST'])
def send_overdue_mails():
    try:
        from datetime import date
        from flask_mail import Message
        from extensions import mail

        today = date.today()
        records = Borrow.query.filter_by(status="Issued").all()
        sent_count = 0

        for record in records:
            if record.due_date < today:
                user = User.query.get(record.user_id)
                book = Book.query.get(record.book_id)

                fine_per_day = 5
                late_days = (today - record.due_date).days
                fine = late_days * fine_per_day

                if user and book:
                    msg = Message(
                        subject="Library Overdue Book Alert",
                        recipients=[user.email]
                    )

                    msg.body = f"""
Hello {user.name},

Your borrowed book is overdue.

Book Name: {book.title}
Issue Date: {record.issue_date}
Due Date: {record.due_date}
Overdue Days: {late_days}
Current Fine: Rs. {fine}

Please return the book immediately to avoid additional fine.

Thank you,
Library Management System
"""
                    mail.send(msg)
                    sent_count += 1

        return jsonify({
            "success": True,
            "message": f"Overdue mails sent successfully to {sent_count} users"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500