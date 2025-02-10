import time
import board
import adafruit_dht
import requests  # Import de la bibliothï¿½que pour envoyer des requï¿½tes HTTP

# Initialisation du capteur DHT11 sur le GPIO 4
sensor = adafruit_dht.DHT11(board.D4)

# Adresse du serveur Node.js oï¿½ les donnï¿½es seront envoyï¿½es
url = "http://192.168.1.62:3000/donnees"  # Remplace par l'IP de ton serveur Node.js

while True:
    try:
        # Lire les donnï¿½es du capteur DHT11
        temperature_c = sensor.temperature
        temperature_f = temperature_c * (9 / 5) + 32
        humidity = sensor.humidity

        # Vï¿½rifier si les donnï¿½es sont valides (non nulles)
        if humidity is not None and temperature_c is not None:
            # Afficher les donnï¿½es dans la console avec les bons caractï¿½res
            print(f"Temp={temperature_c:0.1f}ï¿½C, Temp={temperature_f:0.1f}ï¿½F, Humidity={humidity:0.1f}%")

            # Prï¿½parer les donnï¿½es ï¿½ envoyer
            data = {
                "temperature": temperature_c,
                "humidity": humidity
            }

            # Envoyer les donnï¿½es au serveur via une requï¿½te POST
            try:
                response = requests.post(url, json=data)
                # Vï¿½rifier la rï¿½ponse du serveur
                if response.status_code == 200:
                    print("Donnï¿½es envoyï¿½es avec succï¿½s.")
                else:
                    print(f"Erreur lors de l'envoi des donnï¿½es : {response.status_code}")
            except requests.exceptions.RequestException as e:
                print(f"Erreur de connexion au serveur : {e}")

        else:
            print("Les donnï¿½es sont non valides, rï¿½essayez.")

    except RuntimeError as error:
        # Les erreurs sont frï¿½quentes avec les DHT, juste continuez
        print(f"Erreur de lecture : {error.args[0]}")
        time.sleep(2.0)
        continue
    except Exception as error:
        # Gï¿½rer les exceptions gï¿½nï¿½rales
        sensor.exit()
        raise error

    # Dï¿½lai de 2 secondes entre chaque lecture
    time.sleep(2.0)
