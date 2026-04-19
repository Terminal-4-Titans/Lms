from flask import Blueprint, request, jsonify
from models import db, User
from extensions import mail
from flask_mail import Message
import random
from models import db, User, Query

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')

otp_store = {}          # registration OTP
login_otp_store = {}    # login OTP
forgot_password_otp_store = {}   # forgot password OTP

@user_bp.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({
                "success": False,
                "message": "Email is required"
            }), 400

        # CHECK EMAIL EXIST
        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email already registered"
            }), 400

        otp = str(random.randint(100000, 999999))
        otp_store[email] = otp

        msg = Message(
            subject="Library Registration OTP",
            recipients=[email]
        )

        msg.body = f"Your OTP for Library Registration is: {otp}"

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent to email"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@user_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        email = data.get("email")
        otp = data.get("otp")

        saved_otp = otp_store.get(email)

        if saved_otp == otp:
            return jsonify({
                "success": True,
                "message": "OTP verified"
            }), 200

        return jsonify({
            "success": False,
            "message": "Invalid OTP"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"OTP verification failed: {str(e)}"
        }), 500


@user_bp.route('/create', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({
                "success": False,
                "message": "User already exists"
            }), 400

        new_user = User(
            name=name,
            email=email,
            password=password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "User created successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
@user_bp.route('/all', methods=['GET'])
def get_users():
    users = User.query.all()

    user_list = []

    for user in users:
        user_list.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_active": user.is_active
        })

    return jsonify({
        "success": True,
        "users": user_list
    })

@user_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.get(id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        # Soft delete
        user.is_active = False
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "User deleted (deactivated) successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@user_bp.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email, password=password).first()

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid email or password"
            }), 401

        otp = str(random.randint(100000, 999999))
        login_otp_store[email] = otp

        msg = Message(
            subject="Library Login OTP",
            recipients=[email]
        )

        msg.body = f"Your OTP for Library Login is: {otp}"

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent to your email"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@user_bp.route('/verify-login-otp', methods=['POST'])
def verify_login_otp():
    try:
        data = request.get_json()

        email = data.get("email")
        otp = data.get("otp")

        saved_otp = login_otp_store.get(email)

        if saved_otp == otp:

            user = User.query.filter_by(email=email).first()

            return jsonify({
                "success": True,
                "message": "OTP verified successfully",
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }
            })

        return jsonify({
            "success": False,
            "message": "Invalid OTP"
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@user_bp.route('/my-issued-books/<int:user_id>', methods=['GET'])
def my_issued_books(user_id):
    try:
        from models import Borrow, Book

        records = Borrow.query.filter_by(user_id=user_id).all()

        data = []
        for record in records:
            book = Book.query.get(record.book_id)

            data.append({
                "id": record.id,
                "book_title": book.title if book else "Unknown Book",
                "issue_date": str(record.issue_date),
                "due_date": str(record.due_date),
                "return_date": str(record.return_date) if record.return_date else "",
                "status": record.status,
                "fine": str(record.fine) if record.fine else "0"
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
    
@user_bp.route('/forgot-password-send-otp', methods=['POST'])
def forgot_password_send_otp():
    try:
        data = request.get_json()
        email = data.get("email")

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({
                "success": False,
                "message": "Email not registered"
            }), 404

        otp = str(random.randint(100000, 999999))
        forgot_password_otp_store[email] = otp

        msg = Message(
            subject="Library Forgot Password OTP",
            recipients=[email]
        )
        msg.body = f"Your OTP for password reset is: {otp}"

        mail.send(msg)

        return jsonify({
            "success": True,
            "message": "OTP sent to your email"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@user_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()

        email = data.get("email")
        otp = data.get("otp")
        new_password = data.get("new_password")

        saved_otp = forgot_password_otp_store.get(email)

        if saved_otp != otp:
            return jsonify({
                "success": False,
                "message": "Invalid OTP"
            }), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        user.password = new_password
        db.session.commit()

        forgot_password_otp_store.pop(email, None)

        return jsonify({
            "success": True,
            "message": "Password updated successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@user_bp.route('/dashboard-stats/<int:user_id>', methods=['GET'])
def user_dashboard_stats(user_id):
    try:
        from models import Borrow
        from datetime import date, timedelta

        records = Borrow.query.filter_by(user_id=user_id).all()

        my_issued_books = len(records)

        due_soon = 0
        overdue = 0
        total_fine = 0

        today = date.today()
        two_days_later = today + timedelta(days=2)

        for record in records:
            if record.status == "Issued":
                if today <= record.due_date <= two_days_later:
                    due_soon += 1

                if record.due_date < today:
                    overdue += 1

            if record.fine:
                total_fine += float(record.fine)

        return jsonify({
            "success": True,
            "my_issued_books": my_issued_books,
            "due_soon": due_soon,
            "overdue": overdue,
            "total_fine": total_fine
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@user_bp.route('/send-query', methods=['POST'])
def send_query():
    try:
        data = request.get_json()

        user_id = data.get("user_id")
        subject = data.get("subject")
        message = data.get("message")

        new_query = Query(
            user_id=user_id,
            subject=subject,
            message=message
        )

        db.session.add(new_query)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Query sent successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@user_bp.route('/my-queries/<int:user_id>', methods=['GET'])
def my_queries(user_id):
    try:
        queries = Query.query.filter_by(user_id=user_id).all()

        data = []
        for q in queries:
            data.append({
                "id": q.id,
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

@user_bp.route('/user-category-analysis/<int:user_id>', methods=['GET'])
def user_category_analysis(user_id):
    try:
        from sqlalchemy import func
        from models import Borrow, Book

        results = (
            db.session.query(
                Book.category,
                func.count(Borrow.id)
            )
            .join(Borrow, Borrow.book_id == Book.id)
            .filter(Borrow.user_id == user_id)
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
    
@user_bp.route('/active', methods=['GET'])
def get_active_users():
    try:
        users = User.query.filter_by(is_active=True).all()

        user_list = []

        for user in users:
            user_list.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "is_active": user.is_active
            })

        return jsonify({
            "success": True,
            "users": user_list
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@user_bp.route('/inactive', methods=['GET'])
def get_inactive_users():
    try:
        users = User.query.filter_by(is_active=False).all()

        user_list = []
        for user in users:
            user_list.append({
                "id": user.id,
                "name": user.name,
                "email": user.email
            })

        return jsonify({
            "success": True,
            "users": user_list
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

@user_bp.route('/activate/<int:id>', methods=['PUT'])
def activate_user(id):
    try:
        user = User.query.get(id)

        if user is None:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        user.is_active = True
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "User activated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500