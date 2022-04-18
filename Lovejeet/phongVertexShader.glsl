varying vec3 v_normal;
varying vec3 v_position;
varying mat4 v_viewMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    v_normal = normalMatrix * normal;
    v_position = (modelMatrix * vec4( position, 1.0)).xyz;
    v_viewMatrix = viewMatrix;
}

