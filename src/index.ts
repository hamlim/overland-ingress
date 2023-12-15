/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  DB: D1Database;
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
  //
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  // MY_QUEUE: Queue;
}

type Payload = {
  current: {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      motion: Array<unknown>;
      speed: number;
      battery_level: number;
      wifi: string;
      vertical_accuracy: number;
      horizontal_accuracy: number;
      timestamp: string;
      altitude: number;
      battery_state: string;
    };
  };
  locations: Array<unknown>;
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    let { method } = request;
    let { pathname } = new URL(request.url);

    if (pathname === "/favicon.ico") {
      return new Response("");
    }

    if (pathname === "/testing") {
      let body = await request.json<{
        current: {
          type: "Feature";
          geometry: {
            type: "Point";
            coordinates: [number, number];
          };
          properties: {
            motion: Array<unknown>;
            speed: number;
            battery_level: number;
            wifi: string;
            vertical_accuracy: number;
            horizontal_accuracy: number;
            timestamp: string;
            altitude: number;
            battery_state: string;
          };
        };
        locations: Array<unknown>;
      }>();
      let current = body.current;
      let { results } = await env.DB.prepare(`
        INSERT INTO locations (latitude, longitude, speed, batteryLevel, wifi, verticalAccuracy, horizontalAccuracy, timestamp, altitude, batteryState)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
      `).bind(
        current.geometry.coordinates[0],
        current.geometry.coordinates[1],
        current.properties.speed,
        current.properties.battery_level,
        current.properties.wifi,
        current.properties.vertical_accuracy,
        current.properties.horizontal_accuracy,
        current.properties.timestamp,
        current.properties.altitude,
        current.properties.battery_level,
      ).all();

      return new Response(JSON.stringify(results), { status: 200 });
    }

    switch (method) {
      case "POST": {
        switch (pathname) {
          default: {
            try {
              let body = await request.json<Payload>();
              let current = body.current;
              let { results } = await env.DB.prepare(`
                INSERT INTO locations (latitude, longitude, speed, batteryLevel, wifi, verticalAccuracy, horizontalAccuracy, timestamp, altitude, batteryState)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
              `).bind(
                current.geometry.coordinates[0],
                current.geometry.coordinates[1],
                current.properties.speed,
                current.properties.battery_level,
                current.properties.wifi,
                current.properties.vertical_accuracy,
                current.properties.horizontal_accuracy,
                current.properties.timestamp,
                current.properties.altitude,
                current.properties.battery_level,
              ).all();

              return new Response(JSON.stringify(results), { status: 200 });
            } catch (e) {
              return new Response(JSON.stringify({ success: false }), { status: 500 });
            }
          }
        }
      }
      case "GET":
      default: {
        switch (pathname) {
          case "/":
          default: {
            return new Response(JSON.stringify({ get: true }));
          }
        }
      }
    }
  },
};
