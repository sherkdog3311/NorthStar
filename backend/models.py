from database import db

class Card(db.Model):
    __tablename__ = "CARD"

    CardID = db.Column(db.Integer, primary_key=True)
    CardName = db.Column(db.String(255))
    CardType = db.Column(db.String(100))
    CardColor = db.Column(db.String(50))