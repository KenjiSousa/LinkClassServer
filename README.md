Projeto para servidor em Node para o LinkClass.

Para teste, deve ser iniciado um servidor local (com local-web-server, por
exemplo), e depois compartilhado com um túnel Cloudflare, usando o comando:

```shell
cloudflared tunnel --url http://127.0.0.1:3000 --name blackpearl --hostname http://blkpearl.org/
```

Trocar a `--url` pelo endereço do servidor local.
