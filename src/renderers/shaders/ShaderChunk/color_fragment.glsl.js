export default /* glsl */ `
#if defined( USE_COLOR_ALPHA )

	diffuseColor = vec4(1.0, 0.0, 0.0, 1.0);

#elif defined( USE_COLOR )

	diffuseColor.rgb = vec3(1.0, 0.0, 0.0);

#endif
`;
