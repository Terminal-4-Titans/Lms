from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from extensions import mail
from routes.admin_routes import admin_bp
from routes.librarian_routes import librarian_bp
from routes.user_routes import user_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
mail.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(admin_bp)
app.register_blueprint(librarian_bp)
app.register_blueprint(user_bp)

@app.route('/')
def home():
    return {"message": "Library Resource Management System Backend Running"}

if __name__ == '__main__':
    app.run(debug=True)