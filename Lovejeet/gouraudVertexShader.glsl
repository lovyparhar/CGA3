struct PointLight {
    vec3 u_lightPos;
    vec4 u_diffuseColor;
    vec4 u_specularColor;
    float u_a;
    float u_b;
    float u_c;
};

uniform PointLight pointLights[2];
uniform vec3 u_cameraPos;
uniform float u_kDiffuse;
uniform float u_kAmbient;
uniform float u_kSpecular;
uniform float u_alpha;
uniform vec4 u_ambientColor;

varying vec3 v_normal;
varying vec3 v_position;
varying mat4 v_viewMatrix;

varying vec4 v_color;

vec3 pointLightEffect(PointLight pl, vec3 unitNormal, vec3 position) {

    // The vector from the surface to light in world space
    vec3 revLightWorld = normalize(pl.u_lightPos - position);

    // The vector from the surface to light in view space
    vec3 revLightView = (viewMatrix * vec4( revLightWorld, 0.0)).xyz;


    // Taking care of diffused light
    float diffuseAmt = max(0.0, dot(revLightView, unitNormal));
    vec3 diffuseCont = vec3(u_kDiffuse * pl.u_diffuseColor.xyz * diffuseAmt);


    // Taking care of specular lighting
    vec3 vertToCam = normalize(u_cameraPos - position);
    vec3 halfwayVectorWorld = normalize(vertToCam + revLightWorld);
    vec3 halfwayVectorView = (viewMatrix * vec4( halfwayVectorWorld, 0.0)).xyz;
    
    float specAmt = pow(
        max(0.0, dot(halfwayVectorView, unitNormal)),
        u_alpha
    );

    vec3 specCont = vec3(u_kSpecular * pl.u_specularColor.xyz * specAmt);


    // Taking the attenuation due to distance of the light
    float dis = length(pl.u_lightPos - position);
    float atten = 1.0/(pl.u_a + pl.u_b * dis + pl.u_c * dis * dis);


    // Taking care of ambient lighting
    vec3 ambientCont = vec3(u_kAmbient * u_ambientColor);


    return (atten * (diffuseCont + specCont) + ambientCont);
}

void main() {

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );

    vec3 unitNormal = normalize(normalMatrix * normal);
    vec3 position = (modelMatrix * vec4( position, 1.0)).xyz;

    vec3 res = vec3(0.0,0.0,0.0);
    for(int i = 0; i < 2; i++) {
        res += pointLightEffect(pointLights[i], unitNormal, position);
    }

    v_color = vec4 (
        res, 
        1.0
    );
}

