import { RouterOutlet } from '@angular/router';
import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {
  Engine,
  WebGPUEngine,
  GlslangOptions,
  Effect,
  Scene,
  CreateBox,
  MeshBuilder,
  FreeCamera,
  Vector3, HemisphericLight, ComputeShader
} from "@babylonjs/core";

import {CodeEditorModule, CodeModel} from "@ngstack/code-editor";

import '@babylonjs/core/Engines/WebGPU/Extensions/';

// shadows
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';

// texture loading
import '@babylonjs/core/Materials/Textures/Loaders/envTextureLoader'
// needed for skybox textur'
import '@babylonjs/core/Misc/dds'
// edge'
import '@babylonjs/core/Rendering/edgesRenderer'
// anim'tion'
import '@babylonjs/core/Animations/animatable'
// import {WebGPUEngine} from "@babylonjs/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'BabylonAngularWebGPUBug';
  @ViewChild('canvas', {static: true}) private canvas?: ElementRef<HTMLCanvasElement>;
  private engine?: WebGPUEngine;
  private scene?: Scene;

  constructor(private ngZone: NgZone) {
  }

  theme = 'hc-black';

  codeModel: CodeModel = {
    language: 'wgsl',
    uri: 'main.glsl',
    value: `void main() {
    gl_Position = worldViewProjection * position;
}`
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.engine = new WebGPUEngine(this.canvas.nativeElement);
      this.setupScene();
    }
  }

  async setupScene(this: AppComponent) {
    console.log("Setup scene!");
    if (!navigator.gpu) {
      alert("Web GPU is not supported on your platform so far.");
      return;
    }
    if (this.engine == undefined) return;

    await this.engine?.initAsync({},
        {
          jsPath: "https://cdn.babylonjs.com/twgsl/twgsl.js",
          wasmPath: "https://cdn.babylonjs.com/twgsl/twgsl.wasm"
        });
    //this.engine.displayLoadingUI();
    if (this.canvas)
      this.scene = this.createScene(this.engine, this.canvas.nativeElement);
    this.ngZone?.runOutsideAngular(() => {
      this.engine?.runRenderLoop(() => {
        this.scene?.render();
      });
    });
  }

  createScene(engine: Engine, canvas: HTMLCanvasElement): Scene {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    return scene;
  };

  protected readonly alert = alert;
}
