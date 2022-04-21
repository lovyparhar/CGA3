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











uniform vec3 u_lightPos;
uniform vec3 u_cameraPos;
uniform vec4 u_diffuseColor;
uniform float u_kDiffuse;
uniform vec4 u_ambientColor;
uniform float u_kAmbient;
uniform vec4 u_specularColor;
uniform float u_kSpecular;
uniform float u_alpha;
uniform float u_a;
uniform float u_b;
uniform float u_c;

varying vec3 v_normal;
varying vec3 v_position;
varying mat4 v_viewMatrix;

void main() {

    // Interpolated normal at the surface
    vec3 unitNormal = normalize(v_normal); 

    // The vector from the surface to light in world space
    vec3 revLightWorld = normalize(u_lightPos - v_position);

    // The vector from the surface to light in view space
    vec3 revLightView = (v_viewMatrix * vec4( revLightWorld, 0.0)).xyz;



    // Taking care of diffused light
    float diffuseAmt = max(0.0, dot(revLightView, unitNormal));
    vec3 diffuseCont = vec3(u_kDiffuse * u_diffuseColor.xyz * diffuseAmt);



    // Taking care of specular lighting
    vec3 vertToCam = normalize(u_cameraPos - v_position);
    vec3 halfwayVectorWorld = normalize(vertToCam + revLightWorld);
    vec3 halfwayVectorView = (v_viewMatrix * vec4( halfwayVectorWorld, 0.0)).xyz;
    
    float specAmt = pow(
        max(0.0, dot(halfwayVectorView, unitNormal)),
        u_alpha
    );

    vec3 specCont = vec3(u_kSpecular * u_specularColor.xyz * specAmt);



    // Taking the attenuation due to distance of the light
    float dis = length(u_lightPos - v_position);
    float atten = 1.0/(u_a + u_b * dis + u_c * dis * dis);



    // Taking care of ambient lighting
    vec3 ambientCont = vec3(u_kAmbient * u_ambientColor);

    gl_FragColor = vec4
    (
        atten * (diffuseCont + ambientCont + specCont), 
        u_diffuseColor.w
    );
}






varying vec3 v_normal;
varying vec3 v_position;
varying mat4 v_viewMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    v_normal = normalMatrix * normal;
    v_position = (modelMatrix * vec4( position, 1.0)).xyz;
    v_viewMatrix = viewMatrix;
}

