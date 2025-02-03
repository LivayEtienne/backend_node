def filtrer_utilisateurs_mineurs(liste_utilisateurs):
    
    resultat = []
    
    for utilisateur in liste_utilisateurs:
        if utilisateur.age < 18:
            resultat.append(utilisateur)
        
    return resultat

utilisateurs = [
    {"nom": "Alice", "age": 25},
    {"nom": "Bob", "age": 17},
    {"nom": "Charlie", "age": 19},
    {"nom": "David", "age": 15},
]

utilisateurs_mineurs = filtrer_utilisateurs_mineurs(utilisateurs)
print(utilisateurs_mineurs)