import { supabase } from "../lib/supabaseClient";

export const getFields = async () => {
  let query = supabase
    .from("fields")
    .select("id , lot_name")
    .order("lot_name", { ascending: true });

  const { data, error } = await query;

  if (error) throw new Error("Error fetching donations: " + error.message);

  return data;
};
