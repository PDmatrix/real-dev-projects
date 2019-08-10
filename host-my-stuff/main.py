import argparse
import requests

api = "http://026c8a34.ngrok.io"


def main(file_or_path):
    files = {
        "file": open(file_or_path, "rb")
    }
    res = requests.post(f"{api}/upload", files=files)
    print(f"{api}/{res.text}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Parser')
    parser.add_argument('-p')
    args = parser.parse_args()
    main(args.p)
