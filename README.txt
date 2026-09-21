THE RELATIONSHIP COURT

This ZIP intentionally does NOT contain Boy.xlsx or Girl.xlsx.
Add your own Excel files to the assets folder.

REQUIRED ASSETS
---------------
assets/Boy.xlsx
assets/Girl.xlsx

The website reads the Excel files directly from disk through the local server every time a POV is opened. There are NO hard-coded/fallback questions in this version. If you edit an Excel file, save it, then start/reload the website and select the POV again; the latest saved questions are read.

EXCEL FORMAT
------------
Row 1 may contain headers:
A = Point
B = Reaction Button 1
C = Reaction Button 1 Answer
D = Reaction Button 2
E = Reaction Button 2 Answer

Example:
A2: Na First Point Enti Ante Mundu Vinatam Nerchuko
B2: Sare Chepu
C2: Good
D2: Na istam
E2: Ive Taginchuko

A3...E3 = next question

Leave ONE completely blank row after the last question. The first non-empty value in column A after that blank row is treated as the final love/apology point.

FLOW
----
Question A-row -> click B or D -> show C or E -> NEXT -> next question.
After all questions -> final point/love letter -> 🎁 Open -> Final.mp4 plays.
The video does not autoplay and closes automatically when it ends.

RUN
---
1. Put Boy.xlsx and Girl.xlsx inside assets.
2. Double-click start.bat.
3. Keep the black command window open.
4. Open http://localhost:8000 if the browser does not open automatically.

Do not rename the image/video assets.
