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

vec3 pointLightEffect(PointLight pl, vec3 unitNormal) {

    // The vector from the surface to light in world space
    vec3 revLightWorld = normalize(pl.u_lightPos - v_position);

    // The vector from the surface to light in view space
    vec3 revLightView = (v_viewMatrix * vec4( revLightWorld, 0.0)).xyz;


    // Taking care of diffused light
    float diffuseAmt = max(0.0, dot(revLightView, unitNormal));
    vec3 diffuseCont = vec3(u_kDiffuse * pl.u_diffuseColor.xyz * diffuseAmt);


    // Taking care of specular lighting
    vec3 vertToCam = normalize(u_cameraPos - v_position);
    vec3 halfwayVectorWorld = normalize(vertToCam + revLightWorld);
    vec3 halfwayVectorView = (v_viewMatrix * vec4( halfwayVectorWorld, 0.0)).xyz;
    
    float specAmt = pow(
        max(0.0, dot(halfwayVectorView, unitNormal)),
        u_alpha
    );

    vec3 specCont = vec3(u_kSpecular * pl.u_specularColor.xyz * specAmt);


    // Taking the attenuation due to distance of the light
    float dis = length(pl.u_lightPos - v_position);
    float atten = 1.0/(pl.u_a + pl.u_b * dis + pl.u_c * dis * dis);


    // Taking care of ambient lighting
    vec3 ambientCont = vec3(u_kAmbient * u_ambientColor);


    return (atten * (diffuseCont + specCont) + ambientCont);
}

void main() {

    // Interpolated normal at the surface
    vec3 unitNormal = normalize(v_normal); 

    vec3 res = vec3(0.0,0.0,0.0);
    for(int i = 0; i < 2; i++) {
        res += pointLightEffect(pointLights[i], unitNormal);
    }

    gl_FragColor = vec4(res, 1.0);
    // gl_FragColor = vec4(pointLightEffect(pointLights[1], unitNormal), 1.0);
}