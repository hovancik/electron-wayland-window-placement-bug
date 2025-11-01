## Minimal Multi-Display Electron Demo

This app creates one window per connected display and shows the display number (1-based) and internal Electron display id to demonstrate bug with window placement in Wayland.

### Screenshot

With 2 displays, both window are shown in one display.
![Multi-display demo](./img.png)

### Run

```bash
npm install
npm start
```

### Workaround

```bash
npm start -- --ozone-platform=x11
```
