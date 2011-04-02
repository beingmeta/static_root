%_256.png: %.png
	convert $^ -resize 256x256 $@

%_128.png: %.png
	convert $^ -resize 128x128 $@

%_64.png: %.png
	convert $^ -resize 64x64 $@

%_32.png: %.png
	convert $^ -resize 32x32 $@

%_24.png: %.png
	convert $^ -resize 24x24 $@

%_16.png: %.png
	convert $^ -resize 16x16 $@

%.ico: %.png
	png2ico $@ --colors 16 $^

podspots: std_podspots dark_podspots

std_podspots: \
 podspot_256.png podspot_128.png podspot_64.png \
 podspot_32.png podspot_24.png podspot_16.png \
 podspot0_256.png podspot0_128.png podspot0_64.png \
 podspot0_32.png podspot0_24.png podspot0_16.png \
 podspot1_256.png podspot1_128.png podspot1_64.png \
 podspot1_32.png podspot1_24.png podspot1_16.png \
 podspot2_256.png podspot2_128.png podspot2_64.png \
 podspot2_32.png podspot2_24.png podspot2_16.png

dark_podspots:  \
 darkpodspot_256.png darkpodspot_128.png darkpodspot_64.png \
 darkpodspot_32.png darkpodspot_24.png darkpodspot_16.png \
 darkpodspot0_256.png darkpodspot0_128.png darkpodspot0_64.png \
 darkpodspot0_32.png darkpodspot0_24.png darkpodspot0_16.png \
 darkpodspot1_256.png darkpodspot1_128.png darkpodspot1_64.png \
 darkpodspot1_32.png darkpodspot1_24.png darkpodspot1_16.png \
 darkpodspot2_256.png darkpodspot2_128.png darkpodspot2_64.png \
 darkpodspot2_32.png darkpodspot2_24.png darkpodspot2_16.png

ico_files: podspot_16.ico darkpodspot_16.ico
