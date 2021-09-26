what these files do:

service.ts:
  provides sync ability to the whole app
  note of current implementation:
    broadcast channel does not send message to current page

live.ts:
  uses service.ts, make a geogebra applet sync with others
