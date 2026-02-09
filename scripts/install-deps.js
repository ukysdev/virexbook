import { execSync } from "child_process";

execSync("npm install @supabase/ssr @supabase/supabase-js swr", {
  stdio: "inherit",
  cwd: process.cwd(),
});

console.log("Dependencies installed successfully");
