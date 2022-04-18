// Vertex Shader
varying vec3 v_normal;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    v_normal = normalMatrix * normal;
}

// Fragment Shader
uniform vec3 u_revLight;
uniform vec4 u_color;
varying vec3 v_normal;

void main() {
    vec3 unitNormal = normalize(v_normal);
    vec3 intensity = vec3(dot(u_revLight, unitNormal));
    gl_FragColor = vec4(u_color.xyz*intensity, u_color.w);
}