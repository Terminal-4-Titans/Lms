class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:1234@localhost/library_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "Your gmail Id"
    MAIL_PASSWORD = "Your app password"
    MAIL_DEFAULT_SENDER = "Your gmail Id"