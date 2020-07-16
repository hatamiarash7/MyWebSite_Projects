#!/usr/bin/python3
import dns.resolver
import random, time
dns.resolver.nameservers = ['localhost']

letters= [chr(ord('a')+i) for i in range(26)]
types = ['NS', 'A', 'AAAA', 'MX']
qps = 1

while True:
        domain = ""
        for i in range(5):
                domain += random.choice(letters)
        domain += ".com"
        rt = random.choice(types)
        print(domain+", "+rt)
        try:
                dns.resolver.query(domain, rt)
        except dns.resolver.NXDOMAIN:
                pass
        except dns.resolver.NoAnswer:
                pass
        except dns.resolver.Timeout:
                pass
        except dns.resolver.YXDOMAIN:
                pass
        except dns.resolver.NoNameservers:
                pass
        time.sleep(qps)
