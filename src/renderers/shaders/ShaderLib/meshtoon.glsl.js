export const vertex = /* glsl */ `
#define TOON

varying vec3 vViewPosition;


#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

}
`;

export const fragment = /* glsl */ `
#define TOON
#define Pampa
#define USE_MAP
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
uniform float myFactor;
uniform float myFactorMark;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	// diffuseColor.rgb = vec3(1.0, 0.0, 0.0);
	vec4 sampledDiffuseColor1 = texture2D( map, vMapUv );
	diffuseColor = sampledDiffuseColor1;

	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

	// edit normal of geometry to control the area of toon shadow
	normal.y *= 0.1;



	// accumulation
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>

	// modulation
	#include <aomap_fragment>





	vec3 outgoingLight = reflectedLight.directDiffuse;
	outgoingLight += reflectedLight.indirectDiffuse;
	outgoingLight += totalEmissiveRadiance;

	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

	float myFactorMark1 = 1.0;
	float useMyShader = 1.0;
	float myVal = 0.6;
	vec3 myFactor1 = vec3(myVal, myVal, myVal);

	vec3 myColor = max(myFactor1, outgoingLight);

	if(useMyShader > 0.0) {
		gl_FragColor = vec4(diffuseColor.r * myColor.r, 
			diffuseColor.g * myColor.g, 
			diffuseColor.b * myColor.b, 
			diffuseColor.a);

		if (myFactorMark1 < 0.1) {
			gl_FragColor = vec4(diffuseColor.r * outgoingLight.r, diffuseColor.g * outgoingLight.g, diffuseColor.b * outgoingLight.b, diffuseColor.a);
		}
		
	}



}
`;
