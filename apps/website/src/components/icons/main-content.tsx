
import { createSignal } from "solid-js";
import { Box } from "@radix-solid/themes";
import { AllIcons } from "./all-icons";
import { SearchBar } from "./search-bar";
import { SearchResults } from "./search-results";
export const MainContent = () => {
  const [searchValue, setSearchValue] = createSignal("");
  return <>
			<SearchBar value={searchValue()} onValueChange={setSearchValue} />
			<SearchResults value={searchValue()} />
			<Box px={{
      initial: "5",
      sm: "6"
    }} pb={{
      initial: "6",
      sm: "7"
    }} style={{
      "display": searchValue() ? "none" : "block"
    }}>
				<AllIcons />
			</Box>
		</>;
};
