export const outlineShader = `#version 300 es
precision mediump float;

uniform sampler2D u_graphic;
in vec2 v_uv;
out vec4 fragColor;

void main() {
  vec4 color = texture(u_graphic, v_uv);
  
  // Set outline thickness step (adjust depending on texture size)
  vec2 size = vec2(1.0 / 64.0, 1.0 / 64.0); 
  
  // Sample adjacent pixels
  float alpha = color.a;
  alpha += texture(u_graphic, v_uv + vec2(0.0, size.y)).a;
  alpha += texture(u_graphic, v_uv - vec2(0.0, size.y)).a;
  alpha += texture(u_graphic, v_uv + vec2(size.x, 0.0)).a;
  alpha += texture(u_graphic, v_uv - vec2(size.x, 0.0)).a;
  
  if (color.a == 0.0 && alpha > 0.0) {
    fragColor = vec4(1.0, 1.0, 0.0, 1.0); // Yellow outline
  } else {
    fragColor = color;
  }
}`;