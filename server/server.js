import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
const port = 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Allowed layers and their RPC functions
const LAYERS = {
  trees: "get_tree_tile",
  tree_lines: "get_tree_line_tile",
  fields: "get_field_tile",
};

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Tile endpoint
app.get("/tiles/:layer/:z/:x/:y.pbf", async (req, res) => {
  const { layer, z, x, y } = req.params;

  // Validate layer
  if (!LAYERS[layer]) {
    return res.status(400).json({ error: "Invalid layer" });
  }

  try {
    const { data, error } = await supabase.rpc(LAYERS[layer], {
      z: parseInt(z),
      x: parseInt(x),
      y: parseInt(y),
    });

    if (error) throw error;

    const hex = data.replace(/^\\x/, "");

    const buffer = Buffer.from(hex, "hex");

    res.setHeader("Content-Type", "application/x-protobuf");
    res.send(buffer);
  } catch (err) {
    console.error("Tile error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Lots Endpoint
app.get("/lots/:lot/:z/:x/:y.pbf", async (req, res) => {
  const { lot, z, x, y } = req.params;
  try {
    const { data, error } = await supabase.rpc("get_fields_features_mvt", {
      lot_id: parseInt(lot),
      z: parseInt(z),
      x: parseInt(x),
      y: parseInt(y),
    });

    if (error) throw error;

    const hex = data.replace(/^\\x/, "");

    const buffer = Buffer.from(hex, "hex");

    res.setHeader("Content-Type", "application/x-protobuf");
    res.send(buffer);
  } catch (err) {
    console.error("Tile error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
