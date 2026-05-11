export function readState() {
  const params = new URLSearchParams(location.search);
  return {
    category: params.get("category") || "all",
    search: params.get("search") || "",
    sort: params.get("sort") || "default",
  };
}

export function writeState(state) {
  const params = new URLSearchParams();
  if (state.category && state.category !== "all") params.set("category", state.category);
  if (state.search) params.set("search", state.search);
  if (state.sort && state.sort !== "default") params.set("sort", state.sort);
  const qs = params.toString();
  const url = qs ? `${location.pathname}?${qs}` : location.pathname;
  history.replaceState(null, "", url);
}
