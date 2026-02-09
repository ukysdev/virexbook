import { execSync } from "child_process";

console.log("Installing @supabase/ssr, @supabase/supabase-js, and swr...");
execSync("pnpm add @supabase/ssr @supabase/supabase-js swr", {
  stdio: "inherit",
  cwd: process.cwd(),
});
console.log("Dependencies installed successfully.");
