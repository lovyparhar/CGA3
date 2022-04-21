## Running the application
For this, you need to serve the static files using any server. eg.
1. If you are using VS Code, you can use the 'live server' plugin. [https://www.freecodecamp.org/news/vscode-live-server-auto-refresh-browser/]

1. If you have Python installed locally : 
	1. If Python version 3.X is available :
	`python3 -m http.server`
	2. If Python version 2.X is available :
	`python -m SimpleHTTPServer`

1. If you have a node setup, you can do :
	1. `npm install --global http-server` 
	2. `http-server`



## Using the application 
The application has 3 modes:
1. **BASIC MODE:** In this mode, only the shading models (Gouraud and Phong shading models) can be toggled. This is done by pressing the key 's'.

2. **ILLUMINATOR MODE:** This mode is entered by pressing the key 'l'. In this mode, after selecting an object, the position of the light corresponding to the object can be moved up, down, front, back, left and right using the keys 'u', 'd', down arrow, up arrow, left arrow and right arrow respectively.

3. **TRANSFORMATION MODE:** This mode is entered by pressing the key 'm'. In this mode, transformations like rotation, translation and scaling can be performed on the selected object. Rotations are performed using a virtual trackball(position of the mouse in the screen). Translation of the objects have the same key bindings as the translation of the light. Scaling is done using the '+'/'-' keys ('+' for scaling up and '-' for scaling down).


## Key Bindings:
1. s: Toggle between the shading models.
2. l: Toggle in and out of the illuminator mode.
3. m: Toggle in and out of the mesh-transformation mode.
4. Up arrow: Move the selected object/light away from the camera.
5. Down arrow: Move the selected object/light towards the camera.
6. Left Arrow: Move the selected object/light along the negative x-axis.
7. Right Arrow: Move the selected object/light along the positive x-axis.
8. u: Move the selected object/light along the positive y-axis.
9. d: Move the selected object/light along the negative y-axis.
10. +: Scale up the selected object.
11. -: Scale down the selected object.
12. 0: Switch off the light corresponding to the selected object.
13. 1: Switch on the light corresponding to the selected object.
14. 2: Deselect mesh.
15. 3: Select teapot.
16. 4: Select sphere.