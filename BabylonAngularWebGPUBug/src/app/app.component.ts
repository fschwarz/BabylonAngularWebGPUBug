import { RouterOutlet } from '@angular/router';
import {AfterViewInit, Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import {Engine, WebGPUEngine, GlslangOptions, Effect, Scene} from "@babylonjs/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BabylonAngularWebGPUBug';
  @ViewChild('canvas', {static: true}) private canvas?: ElementRef<HTMLCanvasElement>;
  private engine?: WebGPUEngine;
  private scene?: Scene;

  constructor(private ngZone: NgZone) {}
  ngAfterViewInit(): void {
    if (this.canvas) {
      this.engine = new WebGPUEngine(this.canvas.nativeElement);
      this.setupScene();
    }
  }

  async setupScene(this : AppComponent)
  {
    console.log("Setup scene!");
    if (!navigator.gpu) {
      alert("Web GPU is not supported on your platform so far.");
      return;
    }
    if(this.engine == undefined) return;

    await this.engine?.initAsync({},
      {
        jsPath: "https://cdn.babylonjs.com/twgsl/twgsl.js",
        wasmPath: "https://cdn.babylonjs.com/twgsl/twgsl.wasm"
      });
    this.engine.displayLoadingUI();
    this.scene = new Scene(this.engine);
    this.ngZone?.runOutsideAngular(() => {
      this.engine?.runRenderLoop(() => {
        this.scene?.render();
      });
    });
  }
}
