uniform vec3 u_lightPos;
uniform vec3 u_lightTarget;
uniform vec3 u_cameraPos;
uniform vec4 u_diffuseColor;
uniform float u_kDiffuse;
uniform vec4 u_ambientColor;
uniform float u_kAmbient;
uniform vec4 u_specularColor;
uniform float u_kSpecular;
uniform float u_alpha;

varying vec3 v_normal;
varying vec3 v_position;
varying mat4 v_viewMatrix;

void main() {

    // Interpolated normal at the surface
    vec3 unitNormal = normalize(v_normal); 

    // The vector from the surface to light in world space
    vec3 revLightWorld = normalize(u_lightPos - u_lightTarget);

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



    // Taking care of ambient lighting
    vec3 ambientCont = vec3(u_kAmbient * u_ambientColor);

    gl_FragColor = vec4
    (
        diffuseCont + ambientCont + specCont, 
        u_diffuseColor.w
    );
}