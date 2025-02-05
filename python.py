def afficher_user():
    personnes= [
        {"nom": "Jean", "age": 33},
        {"nom": "Marie", "age": 25},
        {"nom": "Pierre", "age": 40}
    ]
    
    for personne in personnes:
        print(f"{personne['nom']} {len(personne['nom'])}")

afficher_user()