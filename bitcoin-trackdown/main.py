import requests 

flatten = lambda l: [item for sublist in l for item in sublist]

def main():
    while True:
        address = input()
        res = requests.get("https://blockchain.info/rawaddr/" + address)
        if (res.status_code == 200):
            ans = []
            for tx in res.json()['txs']:
                if tx["result"] == 0:
                    ans += list(map(lambda x: [x['addr'], x['value']], tx['out']))
            ans = sorted(ans, key=lambda x: x[1],  reverse=True)
            if ans == []:
                print(ans)
            else:
                fmt = "["
                for el in ans[:10]:
                    fmt += '["{}", {}], '.format(el[0], el[1])
                fmt = fmt[:-2] + "]"
                print(fmt)
        else:
            print([])

if __name__ == "__main__":
    main()