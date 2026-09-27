import re
css=open('style.css').read(); body=open('body.html').read()
js=open('core.js').read()+"\n"+open("icons.js").read()+"\n"+open("qr.js").read()+"\n"+open('tpl.js').read()+"\n"+open('tpl2.js').read()+"\n"+open('boot.js').read()
fonts='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=Manrope:wght@400;600;800&family=Poppins:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Sora:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&family=Playfair+Display:wght@500;700;800&family=Fraunces:opsz,wght@9..144,400..800&family=Cormorant+Garamond:wght@500;600;700&family=Lora:wght@400;600&family=Oswald:wght@500;700&family=Anton&family=Bebas+Neue&family=Archivo+Black&family=Great+Vibes&family=Allura&family=Pacifico&family=Dancing+Script:wght@500;700&family=Syne:wght@500;700;800&family=Unbounded:wght@500;700&family=Cinzel:wght@500;700&family=DM+Serif+Display&family=Bricolage+Grotesque:wght@400;600;800&family=Caveat:wght@500;700&family=Barlow+Condensed:wght@500;700&display=swap">'
inner=f'<title>Manifesti</title>\n{fonts}\n<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n'
open('/tmp/fragment.html','w').write(inner)
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'+inner.replace('<title>Manifesti</title>','<title>Manifesti</title>',1)+'</head><body></body></html>'
# standalone: body content should be inside body -> restructure
head_end=inner.index('</style>')+len('</style>')
head=inner[:head_end]; rest=inner[head_end:]
full='<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'+head+'\n</head><body>\n'+rest+'</body></html>\n'
open('../prototype/index.html','w').write(full)
print(len(full))
