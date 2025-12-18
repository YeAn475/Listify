from app import db

class Music(db.Model):
    __tablename__ = "music"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    artist = db.Column(db.String(100))
    genre = db.Column(db.String(50))
    spotify_id = db.Column(db.String(100), unique=True)
