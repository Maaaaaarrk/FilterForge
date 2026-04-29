var FAQ_DATA = {
  "groups": [
    {
      "id": "getting-started",
      "title": "Getting Started",
      "questions": [
        {
          "id": "what-are-filters",
          "question": "What are item filters and why should I use one?",
          "answer": "<p>Item filters (often called loot filters) are text files that contain rules describing how items should be displayed in-game. They allow you to:</p><ul><li><strong>Hide junk items</strong> so your screen is not cluttered with items you will never pick up</li><li><strong>Highlight valuable drops</strong> with custom colors, minimap icons, and sound notifications</li><li><strong>Add useful info</strong> like socket counts, defense values, item level, vendor price, and more directly to item names and descriptions</li><li><strong>Customize the look</strong> of every item to match your preferences and play style</li></ul><p>Without a filter, you see every item with its default vanilla name. The default filter included with PD2 only has a few simple rules. Once you start farming, a proper filter becomes essential for efficient play. PD2's filtering system is <a href=\"https://github.com/Project-Diablo-2/BH\" target=\"_blank\">open-source</a> and based on BH 1.9.9.</p>",
          "tags": ["filter", "item filter", "loot filter", "lootfilter", "what is", "why", "purpose", "beginner", "new player", "start", "introduction"]
        },
        {
          "id": "how-to-install",
          "question": "How do I install a filter?",
          "answer": "<p>There are two ways to install a filter in PD2:</p><h4>Method 1: Via the PD2 Launcher (Recommended)</h4><ol><li>Open the PD2 Launcher</li><li>Go to the <strong>Item Filter</strong> section</li><li>Browse the list and select a filter</li><li>The launcher downloads it automatically to <code>ProjectD2\\filters</code></li></ol><h4>Method 2: Local Install (Manual)</h4><ol><li>Download or create your <code>.filter</code> file</li><li>Save it to your local filters folder:<br><pre><code>Diablo II\\ProjectD2\\filters\\local\\</code></pre></li><li>Open the PD2 launcher and select it from the <strong>Local</strong> tab</li><li>In-game, make sure <strong>Enable Loot Filter</strong> is turned on in PD2 Options</li></ol><p>Local filters are not updated automatically. If yours is based on a community filter, keep an eye on the original for important changes each season.</p>",
          "tags": ["install", "installation", "setup", "download", "how to", "put", "place", "save", "local", "launcher", "manual"]
        },
        {
          "id": "file-loading-precedence",
          "question": "Which filter file does the game actually load?",
          "answer": "<p>PD2 checks for filter files in this order of precedence:</p><ol><li><strong>Launcher-selected filter</strong> &mdash; saved in <code>ProjectD2\\filters</code> and referenced via a <code>loot.filter</code> system link in the <code>ProjectD2</code> directory</li><li><strong>loot.filter</strong> &mdash; if this file exists in the <code>ProjectD2</code> directory, it is used instead of the default</li><li><strong>default.filter</strong> &mdash; the fallback file in the <code>ProjectD2</code> directory (ships with minimal rules)</li></ol><p>In practice, most players select a filter from the launcher and never worry about this. If you are doing manual installs, place your file in <code>ProjectD2\\filters\\local\\</code> and select it from the Local tab in the launcher.</p>",
          "tags": ["precedence", "priority", "order", "loading", "loot.filter", "default.filter", "which file", "launcher", "override"]
        },
        {
          "id": "enabling-in-game",
          "question": "How do I enable the filter in-game and reload it?",
          "answer": "<p>Filter settings are in the <strong>PD2 Options</strong> menu (accessible from the in-game options screen):</p><ul><li><strong>Enable Loot Filter</strong> &mdash; turns the filter on or off</li><li><strong>Filter Level</strong> &mdash; changes which strictness level is active (if the filter supports multiple levels)</li></ul><p>The default hotkey to <strong>reload the filter</strong> is <strong>Numpad 0</strong>. You can change this in the Configure Controls menu. Reloading is useful when you edit your filter file while the game is running &mdash; just save the file and press Numpad 0 to apply changes instantly.</p><p>These PD2 Options are <em>not</em> affected by filters:</p><ul><li><strong>Show Item Level</strong> &mdash; shows ilvl/alvl in tooltips</li><li><strong>Show Stat Ranges</strong> &mdash; shows variable attribute ranges in tooltips</li><li><strong>Always Show Items</strong> &mdash; shows ground items without holding Alt</li></ul>",
          "tags": ["enable", "turn on", "activate", "reload", "refresh", "numpad", "numpad 0", "hotkey", "PD2 Options", "settings", "in-game"]
        },
        {
          "id": "filter-levels",
          "question": "What are filter levels (strictness levels)?",
          "answer": "<p>Filter levels let a single filter offer multiple strictness settings. By default, there are two levels:</p><ul><li><strong>Level 0: Show All Items</strong> &mdash; always available, prevents any items from being hidden</li><li><strong>Standard</strong> &mdash; the normal filter behavior</li></ul><p>Filters can define up to <strong>12 custom levels</strong> using <code>ItemDisplayFilterName[]</code> at the top of the filter:</p><pre><code>ItemDisplayFilterName[]: Low Strictness\nItemDisplayFilterName[]: Medium Strictness\nItemDisplayFilterName[]: High Strictness</code></pre><p>The order they are listed determines their number (first = level 1, second = level 2, etc.). Rules use <code>FILTLVL</code> in conditions and <code>%TIER-X%</code> in output to respond to the selected level. You change the active level from the in-game PD2 Options menu.</p>",
          "tags": ["filter level", "strictness", "tier", "FILTLVL", "TIER", "level 0", "show all", "ItemDisplayFilterName", "custom levels", "strictness level"]
        },
        {
          "id": "choosing-a-filter",
          "question": "How do I choose a community filter?",
          "answer": "<p>There is no single \"best\" filter. The right choice depends on your play style and preferences. Consider:</p><ul><li><strong>Strictness</strong> &mdash; how aggressively it hides items (newer players should start less strict)</li><li><strong>Information</strong> &mdash; some filters add tons of extra info (defense ranges, runewords, crafting recipes), others keep it minimal</li><li><strong>Aesthetics</strong> &mdash; some are heavily styled with colors and symbols, others maintain a vanilla look</li><li><strong>Season support</strong> &mdash; make sure the filter is updated for the current season</li></ul><p>The <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#List_of_Public_Filters\" target=\"_blank\">PD2 wiki</a> maintains a list of public filters with descriptions and update dates. You can also use <a href=\"https://betweenwalls.github.io/filterbird/?v=PD2\" target=\"_blank\">FilterBird</a> to compare how different filters display specific items.</p>",
          "tags": ["choose", "pick", "best filter", "recommend", "recommendation", "popular", "which", "community", "compare", "FilterBird"]
        },
        {
          "id": "file-format",
          "question": "What file format and encoding should I use?",
          "answer": "<p>Filter files use the <code>.filter</code> extension and are plain text files. Key details:</p><ul><li><strong>Extension:</strong> Must be <code>.filter</code> (not <code>.txt</code>, not <code>.filter.txt</code>)</li><li><strong>Encoding:</strong> <strong>UTF-8</strong> works by default. However, <strong>ANSI encoding</strong> is required if you want to use special characters from the Latin-1 Supplement Unicode block (characters like <code>&micro;&para;&cent;&pound;</code>)</li><li><strong>Editor:</strong> Any text editor works. <a href=\"https://notepad-plus-plus.org/\" target=\"_blank\">Notepad++</a> is popular and has syntax highlighting available via a <a href=\"https://gist.github.com/multimentha/a6f88ff62faef65e3b875d36a01df3bd\" target=\"_blank\">community plugin</a>. VS Code also has a <a href=\"https://marketplace.visualstudio.com/items?itemName=TommyC90.diablo2-loot-filter-hint\" target=\"_blank\">Loot Filter Hints</a> extension.</li></ul><p>Some special characters display as <code>?</code> with HD text disabled, and others do not display at all with HD text enabled. See the <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#Output\" target=\"_blank\">wiki output section</a> for the full character compatibility list.</p>",
          "tags": ["file", "format", "extension", ".filter", "encoding", "UTF-8", "ANSI", "text editor", "notepad++", "special characters", "unicode"]
        },
        {
          "id": "old-season-filters",
          "question": "Can I use a filter from a previous season?",
          "answer": "<p>Using an outdated filter is <strong>not recommended</strong>. Unless the filter was extremely simple, it will likely behave in unexpected and undesirable ways. Each season can bring changes to:</p><ul><li>New items, bases, uniques, and sets</li><li>Changed item codes for new or reworked items</li><li>Rebalanced drop rates that affect what should be shown/hidden</li><li>New filter syntax features</li></ul><p>Always check that your filter has been updated for the current season. The <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#List_of_Public_Filters\" target=\"_blank\">wiki filter list</a> shows update dates &mdash; filters highlighted green are current, those in red are outdated.</p>",
          "tags": ["old", "outdated", "previous season", "last season", "old filter", "season", "update", "compatibility", "broken"]
        }
      ]
    },
    {
      "id": "basic-syntax",
      "title": "Basic Syntax",
      "questions": [
        {
          "id": "rule-format",
          "question": "What is the basic format of a filter rule?",
          "answer": "<p>Every filter rule follows this format:</p><pre><code>ItemDisplay[conditions]: output</code></pre><p>The <strong>conditions</strong> (inside the brackets) specify which items the rule applies to. The <strong>output</strong> (after the colon) specifies how matching items should be displayed.</p><p>Examples:</p><pre><code>// Hide keys\nItemDisplay[key]:\n\n// Show all items with default names\nItemDisplay[]: %NAME%\n\n// Hide gold stacks under 100\nItemDisplay[GOLD&lt;100]:</code></pre><p>If a line does not follow the <code>ItemDisplay[...]:</code> format, it is ignored. Lines meant to be ignored should start with <code>//</code> so the game can skip them efficiently.</p>",
          "tags": ["syntax", "format", "rule", "ItemDisplay", "basic", "structure", "how to write", "conditions", "output"]
        },
        {
          "id": "processing-order",
          "question": "How are filter rules processed?",
          "answer": "<p>Rules are processed <strong>top-to-bottom</strong>, and each item is displayed according to the <strong>first matching rule</strong>. Once a match is found (without <code>%CONTINUE%</code>), processing stops &mdash; no further rules are checked for that item.</p><p>This means <strong>rules higher up have higher priority</strong>. Place your most specific rules at the top and general catch-all rules at the bottom.</p><pre><code>// Specific rule first: highlight Harlequin Crest\nItemDisplay[UNI uap]: %PURPLE%Shako%MAP-9B%\n\n// General rule after: show all uniques\nItemDisplay[UNI]: %GOLD%%NAME%\n\n// Catch-all at bottom: show everything else\nItemDisplay[]: %NAME%</code></pre><p>The only exception to top-to-bottom processing is <strong>notification keywords</strong> (map icons, sounds, NOTIFY), which are processed in a separate pass regardless of position.</p>",
          "tags": ["order", "processing", "top to bottom", "priority", "first match", "precedence", "sequence", "rule order"]
        },
        {
          "id": "hiding-items",
          "question": "How do I hide items?",
          "answer": "<p>To hide items, create a rule with <strong>empty output</strong> (nothing after the colon):</p><pre><code>// Hide keys\nItemDisplay[key]:\n\n// Hide regular 1-socket items after level 10\nItemDisplay[NMAG SOCKETS=1 CLVL&gt;10]:\n\n// Hide ALL items (dangerous!)\nItemDisplay[]:</code></pre><p>When a rule has no output, matching items are not displayed at all. They still exist on the ground and can be revealed with filter level 0 (Show All Items), but they will not appear otherwise.</p><p><strong>Important:</strong> Item descriptions are independent of item names. A hidden item can still show a description if one is defined in braces. To fully hide an item, make sure there is no description either:</p><pre><code>// Hidden with no description\nItemDisplay[key]:\n\n// Hidden name but description still shows\nItemDisplay[key]: {Key}</code></pre>",
          "tags": ["hide", "hidden", "invisible", "remove", "empty output", "no output", "disappear", "filter out", "suppress"]
        },
        {
          "id": "comments",
          "question": "How do I add comments to a filter?",
          "answer": "<p>Use <strong>double slash</strong> (<code>//</code>) to add comments. Everything after <code>//</code> on a line is ignored by the game.</p><pre><code>// This entire line is a comment\nItemDisplay[key]: // hides keys (this part is a comment)\n\n// You can use comments to quickly disable rules:\nItemDisplay[tsc]: //%NAME%  // hides TP scrolls; delete // before %NAME% to show them\n\n// Or disable an entire rule by commenting it out:\n//ItemDisplay[MAG (aqv OR cqv)]: // enable by removing leading //</code></pre><p>Comments are a great way to document your filter, explain complex rules, and temporarily disable rules without deleting them.</p>",
          "tags": ["comment", "comments", "//", "double slash", "note", "annotation", "disable", "documentation"]
        },
        {
          "id": "name-keyword",
          "question": "What does %NAME% do?",
          "answer": "<p><code>%NAME%</code> is a special keyword that represents an item's <strong>default display name</strong>. You can use it as-is, modify it, or replace it entirely:</p><pre><code>// Show default name\nItemDisplay[hdm]: %NAME%              // \"Horadric Malus\"\n\n// Modify the name\nItemDisplay[hdm]: Charsi's %NAME%     // \"Charsi's Horadric Malus\"\n\n// Replace entirely\nItemDisplay[hdm]: Charsi's Hammer     // \"Charsi's Hammer\"</code></pre><p><strong>Important quirk:</strong> Some items have their default color built into <code>%NAME%</code>, so color keywords placed before <code>%NAME%</code> will not change the color. This applies to <strong>runes</strong>, Standard of Heroes, and most PD2-specific non-equipment items (except map/arena scrolls and jewel fragments). To change their color, you must rewrite the name entirely:</p><pre><code>// Color does NOT change (orange is baked into %NAME%):\nItemDisplay[r01]: %RED%%NAME%\n\n// Color DOES change (name is rewritten):\nItemDisplay[r01]: %RED%El Rune</code></pre>",
          "tags": ["%NAME%", "name", "default name", "keyword", "display name", "rename", "baked color", "rune color"]
        },
        {
          "id": "continue-keyword",
          "question": "What does %CONTINUE% do?",
          "answer": "<p><code>%CONTINUE%</code> stores the current rule's output into <code>%NAME%</code> and tells the game to <strong>keep checking further rules</strong> instead of stopping. This lets multiple rules build up an item's appearance layer by layer.</p><pre><code>// Step 1: Append socket count to socketed items\nItemDisplay[SOCKETS&gt;0]: %NAME% [%SOCKETS%]%CONTINUE%\n\n// Step 2: Prepend \"eth\" to ethereal items\nItemDisplay[ETH]: eth %NAME%%CONTINUE%\n\n// Step 3: Final display for all items\nItemDisplay[]: %NAME%</code></pre><p>An ethereal item with 4 sockets would show as: <strong>eth Colossus Voulge [4]</strong></p><p>Without <code>%CONTINUE%</code>, you would need separate rules for every combination (ETH+sockets, ETH+no sockets, non-ETH+sockets, non-ETH+no sockets), growing exponentially with each condition.</p><p><strong>Rules:</strong></p><ul><li><code>%CONTINUE%</code> must be placed <strong>outside</strong> the description braces <code>{}</code></li><li>It applies to both the item name and item description</li><li>Notification keywords (map icons, sounds) bypass <code>%CONTINUE%</code> &mdash; they apply regardless</li></ul>",
          "tags": ["%CONTINUE%", "continue", "chain", "cascade", "multiple rules", "layered", "build up", "accumulate", "keep checking"]
        },
        {
          "id": "aliases",
          "question": "How do aliases work?",
          "answer": "<p>Aliases are a simple find-and-replace that runs when the filter loads. They help make filters more readable and reduce repetition.</p><pre><code>Alias[TextToReplace]: TextToBeInserted</code></pre><p><strong>In conditions:</strong></p><pre><code>Alias[RWBASES]: (NMAG !INF !RW SOCK=0)\nItemDisplay[FILTLVL&gt;1 RWBASES]: %NAME% Socket Me\n\n// Expands to:\nItemDisplay[FILTLVL&gt;1 (NMAG !INF !RW SOCK=0)]: %NAME% Socket Me</code></pre><p><strong>In output:</strong></p><pre><code>Alias[SOCKETCOUNT]: %WHITE% [%GRAY%%SOCK%%WHITE%]\nItemDisplay[NMAG SOCK&gt;0]: %NAME%%SOCKETCOUNT%\n\n// Expands to:\nItemDisplay[NMAG SOCK&gt;0]: %NAME%%WHITE% [%GRAY%%SOCK%%WHITE%]</code></pre><p>Aliases can be defined anywhere in the filter &mdash; they are all processed before any rules are evaluated. They are purely textual substitutions and can contain any text including conditions, output keywords, or partial expressions.</p>",
          "tags": ["alias", "aliases", "Alias", "shortcut", "macro", "find and replace", "substitution", "define", "variable", "reusable"]
        },
        {
          "id": "catch-all-rule",
          "question": "Do I need a catch-all rule at the bottom?",
          "answer": "<p>Not strictly. The game essentially adds an implicit <code>ItemDisplay[]: %NAME%</code> at the bottom of every filter &mdash; any item that does not match a rule is displayed with its default name.</p><p>However, it is <strong>good practice</strong> to include an explicit catch-all at the bottom of your filter:</p><pre><code>// Final catch-all: show everything else with default names\nItemDisplay[]: %NAME%</code></pre><p>This makes the filter's behavior clear and gives you a place to add default modifications (like showing item level in descriptions) that apply to all remaining items:</p><pre><code>// Show all remaining items with ilvl in description\nItemDisplay[]: %NAME%{Item Level: %ILVL%}</code></pre>",
          "tags": ["catch-all", "default", "bottom", "fallback", "last rule", "show all", "remaining items", "implicit"]
        }
      ]
    },
    {
      "id": "conditions",
      "title": "Conditions",
      "questions": [
        {
          "id": "quality-codes",
          "question": "How do I filter by item quality (rarity)?",
          "answer": "<p>Use these quality codes to filter items by their rarity:</p><ul><li><code>NMAG</code> &mdash; Regular (non-magic) items, including most non-equipment items</li><li><code>MAG</code> &mdash; Magic (blue) items</li><li><code>RARE</code> &mdash; Rare (yellow) items</li><li><code>UNI</code> &mdash; Unique (gold) items</li><li><code>SET</code> &mdash; Set (green) items</li><li><code>CRAFT</code> &mdash; Crafted (orange) items</li></ul><pre><code>// Hide all magic items\nItemDisplay[MAG]:\n\n// Highlight uniques with a map icon\nItemDisplay[UNI]: %GOLD%%NAME%%MAP-D3%\n\n// Show crafted items in orange\nItemDisplay[CRAFT]: %ORANGE%%NAME%</code></pre>",
          "tags": ["quality", "rarity", "NMAG", "MAG", "RARE", "UNI", "SET", "CRAFT", "magic", "unique", "set", "rare", "crafted", "regular", "non-magic"]
        },
        {
          "id": "tier-codes",
          "question": "How do I filter by item tier (normal, exceptional, elite)?",
          "answer": "<p>Use these tier codes:</p><ul><li><code>NORM</code> &mdash; Normal tier items</li><li><code>EXC</code> &mdash; Exceptional tier items</li><li><code>ELT</code> &mdash; Elite tier items</li></ul><pre><code>// Hide all normal tier items\nItemDisplay[NMAG NORM]:\n\n// Show only elite ethereal armors\nItemDisplay[NMAG ELT ETH ARMOR]: %NAME% %GRAY%(eth)</code></pre><p>Tier codes apply to equipment only. Miscellaneous items (gems, runes, potions, etc.) do not have tiers.</p>",
          "tags": ["tier", "NORM", "EXC", "ELT", "normal", "exceptional", "elite", "base tier", "item tier"]
        },
        {
          "id": "property-codes",
          "question": "How do I filter by item properties like ethereal, superior, or socketed?",
          "answer": "<p>Use these boolean property codes:</p><ul><li><code>ID</code> &mdash; Item is identified</li><li><code>INF</code> &mdash; Item is inferior (cracked, damaged, etc.)</li><li><code>SUP</code> &mdash; Item is superior</li><li><code>ETH</code> &mdash; Item is ethereal</li><li><code>RW</code> &mdash; Item is a runeword</li><li><code>GEMMED</code> &mdash; Item has at least one gem, rune, or jewel socketed in it</li></ul><pre><code>// Hide inferior items\nItemDisplay[INF]:\n\n// Show ethereal superior armors\nItemDisplay[ETH SUP ARMOR]: %GRAY%Eth Sup %NAME%\n\n// Hide unidentified magic items\nItemDisplay[MAG !ID]:</code></pre><p>Combine property codes with <code>!</code> (NOT) to negate them: <code>!ETH</code> means \"not ethereal\", <code>!ID</code> means \"not identified\".</p>",
          "tags": ["property", "ID", "ETH", "SUP", "INF", "RW", "GEMMED", "ethereal", "superior", "inferior", "identified", "runeword", "socketed"]
        },
        {
          "id": "logical-operators",
          "question": "How do AND, OR, and NOT work in conditions?",
          "answer": "<p>Filter conditions support three logical operators:</p><h4>AND (implicit)</h4><p>Multiple conditions without an operator are joined by AND. These are equivalent:</p><pre><code>ItemDisplay[NMAG SOCKETS=1 CLVL&gt;10]:\nItemDisplay[NMAG AND SOCKETS=1 AND CLVL&gt;10]:</code></pre><h4>OR (requires parentheses)</h4><p>Use <code>OR</code> with parentheses to match any one of several conditions:</p><pre><code>// Hide regular boots, gloves, or belts\nItemDisplay[NMAG (BOOTS OR GLOVES OR BELT) CLVL&gt;10]:</code></pre><p>Parentheses can also group complex logic:</p><pre><code>// Hide small gold or medium gold at high levels\nItemDisplay[(GOLD&lt;100 OR (GOLD&lt;1000 CLVL&gt;50))]:</code></pre><h4>NOT (!)</h4><p>Negate any condition or group with <code>!</code>:</p><pre><code>// Hide magic ethereal armor that is NOT identified\nItemDisplay[MAG ETH ARMOR !ID]:\n\n// Hide magic unid helms except barb/druid/elite\nItemDisplay[MAG !ID HELM !(BAR OR DRU OR ELT)]:</code></pre>",
          "tags": ["AND", "OR", "NOT", "!", "logic", "operator", "parentheses", "boolean", "combine", "negate", "negation", "group"]
        },
        {
          "id": "value-operators",
          "question": "What comparison operators can I use for numeric values?",
          "answer": "<p>Value conditions have three parts: <strong>code</strong>, <strong>operator</strong>, and <strong>value</strong>. Available operators:</p><ul><li><code>&lt;</code> &mdash; Less than</li><li><code>&gt;</code> &mdash; Greater than</li><li><code>=</code> &mdash; Equal to</li><li><code>~</code> &mdash; Between (inclusive range)</li></ul><pre><code>// Sockets less than 3\nItemDisplay[NMAG SOCKETS&lt;3]:\n\n// Sockets equal to 4\nItemDisplay[NMAG SOCKETS=4]: %NAME%\n\n// Sockets between 1 and 2 (inclusive)\nItemDisplay[NMAG SOCKETS~1-2]:\n\n// Same as above without the between operator\nItemDisplay[NMAG SOCKETS&gt;0 SOCKETS&lt;3]:</code></pre><p>The between operator (<code>~</code>) is particularly useful for rune ranges: <code>RUNE~20-25</code> matches runes #20 through #25.</p>",
          "tags": ["operator", "comparison", "value", "less than", "greater than", "equal", "between", "tilde", "~", "range", "numeric"]
        },
        {
          "id": "mutable-codes",
          "question": "What are mutable codes?",
          "answer": "<p>Mutable codes are conditions that depend on <strong>where or how</strong> an item is being viewed, rather than static item properties:</p><ul><li><code>SHOP</code> &mdash; Item is in a merchant's shop window</li><li><code>EQUIPPED</code> &mdash; Item is equipped by the character</li><li><code>MERC</code> &mdash; Item is equipped by the mercenary</li><li><code>INVENTORY</code> &mdash; Item is in the inventory</li><li><code>CUBE</code> &mdash; Item is in the Horadric Cube</li><li><code>STASH</code> &mdash; Item is in the stash</li><li><code>GROUND</code> &mdash; Item is on the ground</li></ul><pre><code>// Change the price color for shop items\nItemDisplay[SHOP]: %NAME%%WHITE%\n\n// Add vendor price to items on the ground\nItemDisplay[GROUND]: %NAME%{$%PRICE%}</code></pre><p>Some value conditions are also mutable: <code>CLVL</code>, <code>CRAFTALVL</code>, <code>DIFF</code>, <code>FILTLVL</code>, <code>MAPID</code>, and <code>CHARSTAT</code> codes.</p>",
          "tags": ["mutable", "SHOP", "EQUIPPED", "MERC", "INVENTORY", "CUBE", "STASH", "GROUND", "location", "context", "where", "equipped", "merchant"]
        },
        {
          "id": "character-class-codes",
          "question": "How do I create class-specific filter rules?",
          "answer": "<p>Use the character class codes to make rules that only apply when playing a specific class:</p><ul><li><code>AMAZON</code></li><li><code>ASSASSIN</code></li><li><code>BARBARIAN</code></li><li><code>DRUID</code></li><li><code>NECROMANCER</code></li><li><code>PALADIN</code></li><li><code>SORCERESS</code></li></ul><pre><code>// Hide keys when playing Assassin (they can open locks)\nItemDisplay[key ASSASSIN]:\n\n// Highlight Paladin shields only for Paladins\nItemDisplay[DIN PALADIN]: %NAME% %GOLD%[Pally Shield]\n\n// Show Sorceress orbs only for Sorceress\nItemDisplay[SOR !SORCERESS NMAG]:</code></pre><p>These check the <strong>current character's class</strong>, not the item's class restriction. Combine them with class-restricted item groups (DRU, BAR, DIN, etc.) for precise control.</p>",
          "tags": ["class", "character", "AMAZON", "ASSASSIN", "BARBARIAN", "DRUID", "NECROMANCER", "PALADIN", "SORCERESS", "class-specific", "build"]
        },
        {
          "id": "stat-addition",
          "question": "Can I combine multiple stat values in a single condition?",
          "answer": "<p>Yes. Any STAT and MULTI attribute codes can be <strong>added together</strong> before the comparison is evaluated:</p><pre><code>// Rares with 80+ total resistance (fire+cold+lightning+poison)\nItemDisplay[RARE FRES+CRES+LRES+PRES&gt;79]: %NAME% %RED%!\n\n// Rares with 10+ total life/mana leech\nItemDisplay[RARE STAT60+STAT62&gt;10]: %NAME% %RED%!</code></pre><p>The following named shortcut codes can be used in addition: <code>STR</code>, <code>DEX</code>, <code>LIFE</code>, <code>MANA</code>, <code>FRES</code>, <code>CRES</code>, <code>LRES</code>, <code>PRES</code>, <code>EDEF</code>, <code>EDAM</code>, <code>FCR</code>, <code>AR</code>, <code>REPLIFE</code>.</p><p>This is extremely powerful for evaluating item quality at a glance, such as checking total resistances on rings/amulets or combined damage stats on weapons.</p>",
          "tags": ["addition", "add", "combine", "sum", "total", "plus", "+", "stat addition", "FRES+CRES", "resistance total"]
        }
      ]
    },
    {
      "id": "item-groups",
      "title": "Item Groups",
      "questions": [
        {
          "id": "armor-groups",
          "question": "What are the armor group codes?",
          "answer": "<p>Armor group codes let you target entire categories of armor. Each has a short code and a named alias:</p><ul><li><code>EQ1</code> / <code>HELM</code> &mdash; Helms (includes class helms like Barbarian helms and Druid pelts)</li><li><code>EQ2</code> / <code>CHEST</code> &mdash; Body armor</li><li><code>EQ3</code> / <code>SHIELD</code> &mdash; Shields (includes Paladin shields and Necromancer shields)</li><li><code>EQ4</code> / <code>GLOVES</code> &mdash; Gloves</li><li><code>EQ5</code> / <code>BOOTS</code> &mdash; Boots</li><li><code>EQ6</code> / <code>BELT</code> &mdash; Belts</li><li><code>EQ7</code> / <code>CIRC</code> &mdash; Circlets (circlet, coronet, tiara, diadem)</li><li><code>ARMOR</code> &mdash; All armor types combined (includes class-restricted armors)</li></ul><pre><code>// Hide non-magic normal tier armor\nItemDisplay[NMAG NORM ARMOR]:\n\n// Show elite circlets\nItemDisplay[ELT CIRC]: %NAME%</code></pre>",
          "tags": ["armor", "EQ1", "EQ2", "EQ3", "EQ4", "EQ5", "EQ6", "EQ7", "HELM", "CHEST", "SHIELD", "GLOVES", "BOOTS", "BELT", "CIRC", "ARMOR", "equipment"]
        },
        {
          "id": "weapon-groups",
          "question": "What are the weapon group codes?",
          "answer": "<p>Weapon groups cover all weapon categories:</p><ul><li><code>WP1</code> / <code>AXE</code> &mdash; Axes (includes throwing axes)</li><li><code>WP2</code> / <code>MACE</code> &mdash; Maces</li><li><code>WP3</code> / <code>SWORD</code> &mdash; Swords</li><li><code>WP4</code> / <code>DAGGER</code> &mdash; Daggers (includes throwing knives)</li><li><code>WP5</code> / <code>THROWING</code> &mdash; All throwing weapons (knives, axes, javelins, throwing potions)</li><li><code>WP6</code> / <code>JAV</code> &mdash; Javelins (includes Amazon javelins)</li><li><code>WP7</code> / <code>SPEAR</code> &mdash; Spears (includes Amazon spears)</li><li><code>WP8</code> / <code>POLEARM</code> &mdash; Polearms</li><li><code>WP9</code> / <code>BOW</code> &mdash; Bows (includes Amazon bows)</li><li><code>WP10</code> / <code>XBOW</code> &mdash; Crossbows</li><li><code>WP11</code> / <code>STAFF</code> &mdash; Staves</li><li><code>WP12</code> / <code>WAND</code> &mdash; Wands</li><li><code>WP13</code> / <code>SCEPTER</code> &mdash; Scepters</li><li><code>WEAPON</code> &mdash; All weapons</li><li><code>1H</code> &mdash; One-handed weapons</li><li><code>2H</code> &mdash; Two-handed weapons</li></ul><p>Mace subtypes: <code>CLUB</code>, <code>TMACE</code> (tipped maces), <code>HAMMER</code>.</p>",
          "tags": ["weapon", "WP1", "WP2", "WP3", "WP4", "WP5", "WP6", "WP7", "WP8", "WP9", "WP10", "WP11", "WP12", "WP13", "AXE", "MACE", "SWORD", "DAGGER", "THROWING", "JAV", "SPEAR", "POLEARM", "BOW", "XBOW", "STAFF", "WAND", "SCEPTER", "WEAPON", "1H", "2H"]
        },
        {
          "id": "class-item-groups",
          "question": "What are the class-restricted item group codes?",
          "answer": "<p>These codes target items that can only be equipped by a specific class:</p><ul><li><code>CL1</code> / <code>DRU</code> &mdash; Druid pelts</li><li><code>CL2</code> / <code>BAR</code> &mdash; Barbarian helms</li><li><code>CL3</code> / <code>DIN</code> &mdash; Paladin shields</li><li><code>CL4</code> / <code>NEC</code> &mdash; Necromancer shields (shrunken heads)</li><li><code>CL5</code> / <code>SIN</code> &mdash; Assassin weapons (claws)</li><li><code>CL6</code> / <code>SOR</code> &mdash; Sorceress weapons (orbs)</li><li><code>CL7</code> / <code>ZON</code> &mdash; Amazon weapons (bows, javelins, spears)</li><li><code>CLASS</code> &mdash; All class-restricted items</li></ul><pre><code>// Show Paladin shields with all res info\nItemDisplay[DIN NMAG]: %NAME% %GOLD%[%RES% res]\n\n// Hide non-elite class items\nItemDisplay[CLASS !ELT NMAG]:</code></pre><p><strong>Note:</strong> These are <strong>item group</strong> codes, not character class codes. <code>DIN</code> matches Paladin shields regardless of what class you are playing. Use <code>PALADIN</code> to check the current character's class.</p>",
          "tags": ["class item", "CL1", "CL2", "CL3", "CL4", "CL5", "CL6", "CL7", "DRU", "BAR", "DIN", "NEC", "SIN", "SOR", "ZON", "CLASS", "pelt", "barbarian helm", "paladin shield", "necromancer shield", "claw", "orb"]
        },
        {
          "id": "misc-groups",
          "question": "What are the miscellaneous item group codes?",
          "answer": "<p>These cover non-equipment items:</p><ul><li><code>JEWELRY</code> &mdash; Rings and amulets</li><li><code>CHARM</code> &mdash; Small, large, and grand charms</li><li><code>QUIVER</code> &mdash; Arrows and bolts</li><li><code>MISC</code> &mdash; All items from misc.txt (potions, gems, runes, ingredients, quest items, etc.)</li></ul><pre><code>// Highlight all jewelry\nItemDisplay[RARE JEWELRY]: %YELLOW%%NAME% %RED%!\n\n// Show all charms with ilvl\nItemDisplay[MAG CHARM]: %NAME%{ilvl: %ILVL%}\n\n// Hide regular quivers\nItemDisplay[NMAG QUIVER]:</code></pre>",
          "tags": ["misc", "JEWELRY", "CHARM", "QUIVER", "MISC", "ring", "amulet", "charm", "arrow", "bolt", "potion", "gem", "rune", "miscellaneous"]
        },
        {
          "id": "item-codes",
          "question": "How do item codes (3-character codes) work?",
          "answer": "<p>Every item in Diablo II has a unique <strong>3-character code</strong> that you can use in conditions to target that specific base item. Examples:</p><ul><li><code>cap</code> &mdash; Cap</li><li><code>uap</code> &mdash; Shako</li><li><code>r01</code> &mdash; El Rune</li><li><code>r33</code> &mdash; Zod Rune</li><li><code>cm1</code> &mdash; Small Charm</li><li><code>cm2</code> &mdash; Large Charm</li><li><code>cm3</code> &mdash; Grand Charm</li><li><code>rin</code> &mdash; Ring</li><li><code>amu</code> &mdash; Amulet</li></ul><pre><code>// Highlight Shakos (elite caps)\nItemDisplay[uap]: %NAME%\n\n// Show all Vex+ runes with map icon\nItemDisplay[RUNE&gt;25]: %ORANGE%%NAME%%BORDER-0B%</code></pre><p>The full list of item codes is available on the <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#Item_Codes\" target=\"_blank\">PD2 wiki</a>. You can also use <code>%CODE%</code> in output to display an item's code.</p>",
          "tags": ["item code", "3-character", "base code", "cap", "uap", "r01", "rin", "amu", "cm1", "specific item", "base item"]
        },
        {
          "id": "special-item-codes",
          "question": "What are the special item codes that don't use normal base codes?",
          "answer": "<p>Some PD2-specific unique items use <strong>custom item codes</strong> instead of their base item's normal code. This means filtering by the base code will <strong>not</strong> match these items:</p><ul><li><code>rar</code> &mdash; <strong>Cage of the Unsullied</strong> (unique Boneweave) &mdash; does NOT respond to <code>uhn</code></li><li><code>rbe</code> &mdash; <strong>Band of Skulls</strong> (unique Mithril Coil) &mdash; does NOT respond to <code>utc</code></li><li><code>ram</code> &mdash; <strong>The Third Eye</strong> (unique amulet) &mdash; does NOT respond to <code>amu</code></li></ul><p>If you want your filter to properly handle these items, you must use their special codes directly:</p><pre><code>// This will NOT match Cage of the Unsullied:\nItemDisplay[UNI uhn]: %NAME%\n\n// This WILL match it:\nItemDisplay[rar]: %GOLD%%NAME%%MAP-D3%\n\n// To catch both normal Boneweaves and the unique:\nItemDisplay[(uhn OR rar)]: %NAME%</code></pre><p>These special codes are a PD2-specific feature for newly added unique items that override their base item's code.</p>",
          "tags": ["special code", "rar", "rbe", "ram", "Cage of the Unsullied", "Band of Skulls", "The Third Eye", "custom code", "override", "base code", "doesn't match"]
        },
        {
          "id": "combining-groups",
          "question": "How do I combine multiple item groups with OR?",
          "answer": "<p>Use <code>OR</code> with parentheses to match items from multiple groups:</p><pre><code>// Hide normal boots, gloves, and belts\nItemDisplay[NMAG (BOOTS OR GLOVES OR BELT)]:\n\n// Show elite axes, swords, or maces\nItemDisplay[ELT NMAG (AXE OR SWORD OR MACE)]: %NAME%\n\n// Match multiple specific item codes\nItemDisplay[(r01 OR r02 OR r03)]: Low Rune</code></pre><p>Remember that conditions without an explicit operator default to AND. So <code>NMAG ELT CHEST</code> means \"non-magic AND elite AND chest armor\".</p>",
          "tags": ["combine", "multiple", "OR", "parentheses", "group", "several", "any of", "either"]
        }
      ]
    },
    {
      "id": "stats-values",
      "title": "Stats & Values",
      "questions": [
        {
          "id": "named-attributes",
          "question": "What named attribute codes are available?",
          "answer": "<p>Named attributes provide convenient shortcuts for commonly checked stats. Key named codes include:</p><ul><li><code>SOCK</code> / <code>SOCKETS</code> &mdash; Number of sockets</li><li><code>DEF</code> &mdash; Total defense</li><li><code>ED</code> &mdash; Enhanced Defense or Enhanced Damage (context-dependent: defense for armor, damage for weapons)</li><li><code>EDEF</code> &mdash; Enhanced Defense (includes runeword/socket bonuses; ED does NOT)</li><li><code>EDAM</code> &mdash; Enhanced Damage (includes runeword/socket bonuses; ED does NOT)</li><li><code>RES</code> &mdash; All Resistances</li><li><code>FRES</code> &mdash; Fire Resistance</li><li><code>CRES</code> &mdash; Cold Resistance</li><li><code>LRES</code> &mdash; Lightning Resistance</li><li><code>PRES</code> &mdash; Poison Resistance</li><li><code>FCR</code> &mdash; Faster Cast Rate</li><li><code>IAS</code> &mdash; Increased Attack Speed</li><li><code>FHR</code> &mdash; Faster Hit Recovery</li><li><code>FBR</code> &mdash; Faster Block Rate</li><li><code>STR</code> &mdash; Strength</li><li><code>DEX</code> &mdash; Dexterity</li><li><code>LIFE</code> &mdash; Life</li><li><code>MANA</code> &mdash; Mana</li><li><code>MFIND</code> &mdash; Magic Find</li><li><code>GFIND</code> &mdash; Gold Find</li><li><code>AR</code> &mdash; Attack Rating</li><li><code>REPLIFE</code> &mdash; Replenish Life</li><li><code>MAXDUR</code> &mdash; Max Durability (conditions only, no output keyword)</li></ul><p>All named attributes (except <code>MAXDUR</code>) can be used in both conditions and output.</p>",
          "tags": ["named", "attribute", "SOCK", "SOCKETS", "DEF", "ED", "EDEF", "EDAM", "RES", "FRES", "CRES", "LRES", "PRES", "FCR", "IAS", "FHR", "FBR", "STR", "DEX", "LIFE", "MANA", "MFIND", "GFIND", "AR", "REPLIFE", "MAXDUR"]
        },
        {
          "id": "ed-vs-edef-edam",
          "question": "What is the difference between ED, EDEF, and EDAM?",
          "answer": "<p>This is a critical distinction that trips up many filter authors:</p><ul><li><code>ED</code> &mdash; Reads the item's <strong>inherent</strong> Enhanced Defense (on armor) or Enhanced Damage (on weapons). Does <strong>NOT</strong> include bonuses added by runewords, socketed gems, runes, or jewels.</li><li><code>EDEF</code> &mdash; Reads the <strong>total</strong> Enhanced Defense including all bonuses from runewords and sockets.</li><li><code>EDAM</code> &mdash; Reads the <strong>total</strong> Enhanced Damage including all bonuses from runewords and sockets.</li></ul><p>Use <code>ED</code> when checking base item quality (e.g., superior items with 20% ED). Use <code>EDEF</code>/<code>EDAM</code> when you want the full picture including socketed/runeword bonuses.</p><pre><code>// Find superior items with 20% enhanced defense\nItemDisplay[SUP ARMOR ED&gt;19]: %NAME% %GREEN%[%ED%%]\n\n// Show total enhanced damage on runeword weapons\nItemDisplay[RW WEAPON]: %NAME%{ED: %EDAM%%}</code></pre>",
          "tags": ["ED", "EDEF", "EDAM", "enhanced defense", "enhanced damage", "difference", "runeword bonus", "socket bonus", "superior"]
        },
        {
          "id": "stat-numbered-codes",
          "question": "How do STAT# numbered codes work?",
          "answer": "<p><code>STAT#</code> codes let you check any item stat by its numeric ID from the game's internal stat table. This covers hundreds of stats not available as named codes:</p><pre><code>// STAT60 = Life Stolen per Hit\nItemDisplay[RARE STAT60&gt;5]: %NAME% %RED%[LL]\n\n// STAT62 = Mana Stolen per Hit\nItemDisplay[RARE STAT62&gt;5]: %NAME% %BLUE%[ML]\n\n// STAT36 = Physical Damage Reduction %\nItemDisplay[STAT36&gt;10]: %NAME% %GOLD%[PDR]\n\n// STAT329 = Fire Skill Damage %\nItemDisplay[STAT329&gt;0]: %NAME%{+%STAT329%% Fire Skill Dmg}</code></pre><p>Common STAT# values:</p><ul><li><code>STAT1</code> &mdash; Energy</li><li><code>STAT3</code> &mdash; Vitality</li><li><code>STAT36</code> &mdash; Physical Damage Reduction %</li><li><code>STAT60</code> &mdash; Life Stolen per Hit %</li><li><code>STAT62</code> &mdash; Mana Stolen per Hit %</li><li><code>STAT86</code> &mdash; Life after each Kill</li><li><code>STAT91</code> &mdash; Requirements %</li><li><code>STAT329-332</code> &mdash; Fire/Lightning/Cold/Poison Skill Damage %</li><li><code>STAT357</code> &mdash; Magic Skill Damage %</li></ul><p>Numbered stat codes can be used in both conditions and output (as <code>%STAT#%</code>).</p>",
          "tags": ["STAT", "STAT#", "numbered", "stat code", "numeric", "ID", "life steal", "mana steal", "damage reduction", "skill damage"]
        },
        {
          "id": "charstat-vs-stat",
          "question": "What is the difference between CHARSTAT# and STAT#?",
          "answer": "<p><code>STAT#</code> checks the stat on the <strong>item</strong> being evaluated. <code>CHARSTAT#</code> checks the same stat on the <strong>character</strong> wearing the item.</p><pre><code>// Check if the ITEM has +10 strength\nItemDisplay[STR&gt;9]: %NAME%\n\n// Check if the CHARACTER has 150+ strength\nItemDisplay[CHARSTAT0&gt;149]: %NAME%</code></pre><p><code>CHARSTAT</code> is a mutable code &mdash; its value changes based on the character's current stats. This is useful for context-dependent filtering, such as:</p><ul><li>Hiding items once your character is strong enough to not need them</li><li>Showing crafting bases only when your character is the right level</li><li>Adjusting filter behavior based on character progression</li></ul><p>The stat ID numbers are the same for both <code>STAT#</code> and <code>CHARSTAT#</code>.</p>",
          "tags": ["CHARSTAT", "STAT", "character stat", "item stat", "difference", "character", "player", "mutable"]
        },
        {
          "id": "info-codes",
          "question": "What info codes are available for conditions and output?",
          "answer": "<p>Info codes provide meta-information about items and game state. They work in both conditions and output (as <code>%CODE%</code>):</p><ul><li><code>ILVL</code> &mdash; Item level (1-99)</li><li><code>ALVL</code> &mdash; Affix level (determines which affixes can roll)</li><li><code>CLVL</code> &mdash; Character level (mutable)</li><li><code>DIFF</code> &mdash; Difficulty (0=Normal, 1=Nightmare, 2=Hell)</li><li><code>GOLD</code> &mdash; Gold stack amount</li><li><code>RUNE</code> &mdash; Rune number (1-33, El=1, Zod=33)</li><li><code>GEMLEVEL</code> &mdash; Gem quality level</li><li><code>PRICE</code> &mdash; Vendor sell price (1-35000)</li><li><code>FILTLVL</code> &mdash; Currently selected filter level</li><li><code>MAPID</code> &mdash; Current zone/map ID</li><li><code>MAPTIER</code> &mdash; Current map tier</li><li><code>MAXSOCKETS</code> &mdash; Maximum possible sockets for the item</li><li><code>CRAFTALVL</code> &mdash; What the ALVL would be if used in a crafting recipe</li><li><code>REROLLALVL</code> &mdash; What the ALVL would be if the item is rerolled via cube</li></ul><pre><code>// Hide low gold in Hell\nItemDisplay[DIFF=2 GOLD&lt;5000]:\n\n// Show ilvl and alvl in description\nItemDisplay[]: %NAME%{alvl: %ALVL%%NL%ilvl: %ILVL%}</code></pre>",
          "tags": ["info", "ILVL", "ALVL", "CLVL", "DIFF", "GOLD", "RUNE", "GEMLEVEL", "PRICE", "FILTLVL", "MAPID", "MAPTIER", "MAXSOCKETS", "CRAFTALVL", "REROLLALVL", "difficulty", "item level"]
        },
        {
          "id": "multi-codes",
          "question": "What are MULTI codes and how do they work?",
          "answer": "<p>MULTI codes handle <strong>multi-layered stats</strong> &mdash; stats that have multiple sub-values indexed by an additional parameter (like class skills, oskills, auras, and charged skills). They use a special format to specify both the stat ID and the sub-index:</p><p>Multi-layered stats are used for things like:</p><ul><li><strong>Class skill bonuses</strong> (which skill tree the bonus applies to)</li><li><strong>Oskills</strong> (which specific skill is granted)</li><li><strong>Aura when equipped</strong> (which aura and at what level)</li><li><strong>Charged skills</strong> (which skill, charges, level)</li></ul><p>In practice, most filter authors use the more convenient <strong>skill codes</strong> (<code>SK#</code>, <code>OS#</code>, <code>CHSK#</code>, <code>CLSK#</code>, <code>TABSK#</code>) rather than raw MULTI codes. MULTI codes are primarily useful when you need to check stats that do not have a named shortcut.</p><p>Like STAT codes, MULTI codes support addition: you can add STAT and MULTI values together in conditions.</p>",
          "tags": ["MULTI", "multi-layered", "layered stat", "sub-index", "class skill", "oskill", "aura", "charged skill", "advanced stat"]
        },
        {
          "id": "prefix-suffix",
          "question": "How do PREFIX and SUFFIX conditions work?",
          "answer": "<p><code>PREFIX</code> and <code>SUFFIX</code> let you check for specific magic affixes on items by their affix ID number. Use the between operator (<code>~</code>) for reliable matching:</p><pre><code>// Check for a specific prefix (e.g., \"of the Whale\" = SUFFIX 90)\nItemDisplay[MAG SUFFIX~90-90]: %NAME% %BLUE%[Whale!]</code></pre><p><strong>Important:</strong> Use the <code>~</code> (between) operator, not <code>&lt;</code> or <code>&gt;</code>, as those operators are unreliable with PREFIX/SUFFIX codes.</p><p>There is also an <code>AUTOMOD</code> code for checking automatic modifiers on class-specific items (like +skills on Paladin shields or Druid pelts).</p><p>The full list of PREFIX, SUFFIX, and AUTOMOD IDs is available on the <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#SUFFIX,_PREFIX,_and_AUTOMOD_IDs\" target=\"_blank\">PD2 wiki</a>.</p>",
          "tags": ["PREFIX", "SUFFIX", "AUTOMOD", "affix", "magic affix", "between", "tilde", "affix ID", "modifier"]
        }
      ]
    },
    {
      "id": "skills",
      "title": "Skills",
      "questions": [
        {
          "id": "allsk-code",
          "question": "How do I check for +All Skills?",
          "answer": "<p>Use the <code>ALLSK</code> code to check for +X to All Skills:</p><pre><code>// Show items with +2 or more to all skills\nItemDisplay[ALLSK&gt;1]: %NAME% %GOLD%[+%ALLSK% All]\n\n// Highlight amulets with +all skills\nItemDisplay[RARE amu ALLSK&gt;0]: %NAME% %GOLD%+%ALLSK%</code></pre><p><code>ALLSK</code> can be used in both conditions and output. It only checks the +All Skills stat, not individual class skill bonuses.</p>",
          "tags": ["ALLSK", "all skills", "+all", "plus all skills", "+skills"]
        },
        {
          "id": "class-skill-codes",
          "question": "How do I check for class-specific skill bonuses?",
          "answer": "<p>Use <code>CLSK0</code> through <code>CLSK6</code> to check +X to a specific class's skills:</p><ul><li><code>CLSK0</code> &mdash; +X to Amazon Skills</li><li><code>CLSK1</code> &mdash; +X to Sorceress Skills</li><li><code>CLSK2</code> &mdash; +X to Necromancer Skills</li><li><code>CLSK3</code> &mdash; +X to Paladin Skills</li><li><code>CLSK4</code> &mdash; +X to Barbarian Skills</li><li><code>CLSK5</code> &mdash; +X to Druid Skills</li><li><code>CLSK6</code> &mdash; +X to Assassin Skills</li></ul><pre><code>// Highlight amulets with +2 Sorceress skills\nItemDisplay[amu CLSK1&gt;1]: %NAME% %BLUE%[+%CLSK1% Sorc]\n\n// Show Paladin skill items for Paladins\nItemDisplay[PALADIN CLSK3&gt;0]: %NAME% %GOLD%[+%CLSK3%]</code></pre>",
          "tags": ["CLSK", "CLSK0", "CLSK1", "CLSK2", "CLSK3", "CLSK4", "CLSK5", "CLSK6", "class skills", "amazon skills", "sorceress skills", "necromancer skills", "paladin skills", "barbarian skills", "druid skills", "assassin skills"]
        },
        {
          "id": "skill-tab-codes",
          "question": "How do I check for skill tab bonuses?",
          "answer": "<p>Use <code>TABSK0</code> through <code>TABSK20</code> (and up to <code>TABSK50</code> for extended tabs) to check +X to specific skill tabs. Each class has 3 tabs:</p><p><strong>Amazon (TABSK0-2):</strong></p><ul><li><code>TABSK0</code> &mdash; Bow and Crossbow</li><li><code>TABSK1</code> &mdash; Passive and Magic</li><li><code>TABSK2</code> &mdash; Javelin and Spear</li></ul><p><strong>Sorceress (TABSK3-5):</strong></p><ul><li><code>TABSK3</code> &mdash; Fire</li><li><code>TABSK4</code> &mdash; Lightning</li><li><code>TABSK5</code> &mdash; Cold</li></ul><p><strong>Necromancer (TABSK6-8):</strong></p><ul><li><code>TABSK6</code> &mdash; Curses</li><li><code>TABSK7</code> &mdash; Poison and Bone</li><li><code>TABSK8</code> &mdash; Summoning</li></ul><p><strong>Paladin (TABSK9-11):</strong></p><ul><li><code>TABSK9</code> &mdash; Combat</li><li><code>TABSK10</code> &mdash; Offensive Auras</li><li><code>TABSK11</code> &mdash; Defensive Auras</li></ul><p><strong>Barbarian (TABSK12-14):</strong></p><ul><li><code>TABSK12</code> &mdash; Combat (Barb)</li><li><code>TABSK13</code> &mdash; Masteries</li><li><code>TABSK14</code> &mdash; Warcries</li></ul><p><strong>Druid (TABSK15-17):</strong></p><ul><li><code>TABSK15</code> &mdash; Summoning (Druid)</li><li><code>TABSK16</code> &mdash; Shapeshifting</li><li><code>TABSK17</code> &mdash; Elemental</li></ul><p><strong>Assassin (TABSK18-20):</strong></p><ul><li><code>TABSK18</code> &mdash; Traps</li><li><code>TABSK19</code> &mdash; Shadow Disciplines</li><li><code>TABSK20</code> &mdash; Martial Arts</li></ul><pre><code>// Highlight items with +Fire Skills (Sorc)\nItemDisplay[TABSK3&gt;0]: %NAME% %RED%[+%TABSK3% Fire]</code></pre>",
          "tags": ["TABSK", "skill tab", "tab", "bow and crossbow", "fire", "lightning", "cold", "curses", "summoning", "combat", "warcries", "traps", "shapeshifting", "elemental", "martial arts"]
        },
        {
          "id": "individual-skill-codes",
          "question": "How do I check for bonuses to individual skills?",
          "answer": "<p>Use <code>SK#</code> where <code>#</code> is the skill ID number to check for +X to a specific skill:</p><pre><code>// SK48 = Nova (Sorceress)\nItemDisplay[SK48&gt;0]: %NAME%{+%SK48% Nova}\n\n// SK54 = Teleport (Sorceress)\nItemDisplay[SK54&gt;0]: %NAME% %BLUE%[Tele +%SK54%]</code></pre><p>Skill IDs are organized by class. Each class has 30 skills numbered sequentially. The full skill ID list is available on the <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#Individual_Skills\" target=\"_blank\">PD2 wiki</a>. Some common ones:</p><ul><li>Amazon: SK0-SK29</li><li>Sorceress: SK30-SK59</li><li>Necromancer: SK60-SK89</li><li>Paladin: SK90-SK119</li><li>Barbarian: SK120-SK149</li><li>Druid: SK150-SK179</li><li>Assassin: SK180-SK209</li></ul>",
          "tags": ["SK", "individual skill", "skill bonus", "+skill", "specific skill", "teleport", "nova", "skill ID"]
        },
        {
          "id": "oskill-codes",
          "question": "How do I check for oskills (skills granted to any class)?",
          "answer": "<p>Use <code>OS#</code> where <code>#</code> is the skill ID number to check for oskills (skills that can be used by any class, not just the skill's native class):</p><pre><code>// OS54 = Teleport as an oskill\nItemDisplay[OS54&gt;0]: %NAME% %BLUE%[OS Tele +%OS54%]\n\n// OS147 = Battle Orders as an oskill  \nItemDisplay[OS147&gt;0]: %NAME% %GOLD%[OS BO +%OS147%]</code></pre><p>Oskills use the same skill ID numbers as <code>SK#</code>. The difference is:</p><ul><li><code>SK#</code> &mdash; Class-specific skill bonus (only works for the skill's native class)</li><li><code>OS#</code> &mdash; Oskill (works for any class)</li></ul>",
          "tags": ["OS", "oskill", "OS#", "granted skill", "any class", "non-class skill", "teleport", "battle orders"]
        },
        {
          "id": "charged-skill-codes",
          "question": "How do I check for charged skills?",
          "answer": "<p>Use <code>CHSK#</code> where <code>#</code> is the skill ID number to check for charged skills (skills with limited charges):</p><pre><code>// Check for Teleport charges\nItemDisplay[CHSK54&gt;0]: %NAME% %BLUE%[Tele Charges]</code></pre><p>Charged skills use the same skill ID numbers as <code>SK#</code> and <code>OS#</code>. The key differences:</p><ul><li><code>SK#</code> &mdash; Permanent class-specific skill bonus</li><li><code>OS#</code> &mdash; Permanent oskill usable by any class</li><li><code>CHSK#</code> &mdash; Skill with limited charges that deplete on use</li></ul><p>Charged skills are less commonly filtered for, but can be useful for finding items with utility charges like Teleport or Lower Resist.</p>",
          "tags": ["CHSK", "charged", "charges", "CHSK#", "skill charges", "limited charges"]
        }
      ]
    },
    {
      "id": "output-colors",
      "title": "Output & Colors",
      "questions": [
        {
          "id": "color-keywords",
          "question": "What color keywords are available?",
          "answer": "<p>Color keywords change the color of all subsequent text in the output. If no color keyword is used, the item's default color applies.</p><ul><li><code>%WHITE%</code> &mdash; White (default for regular items)</li><li><code>%GRAY%</code> &mdash; Gray (default for ethereal/socketed items)</li><li><code>%BLUE%</code> &mdash; Blue (default for magic items)</li><li><code>%YELLOW%</code> &mdash; Yellow (default for rare items)</li><li><code>%GOLD%</code> &mdash; Gold (default for unique items, runeword names)</li><li><code>%GREEN%</code> &mdash; Green (default for set items)</li><li><code>%DARK_GREEN%</code> &mdash; Dark Green</li><li><code>%TAN%</code> &mdash; Tan</li><li><code>%BLACK%</code> &mdash; Black</li><li><code>%PURPLE%</code> &mdash; Purple</li><li><code>%RED%</code> &mdash; Red (default for broken items)</li><li><code>%ORANGE%</code> &mdash; Orange (default for crafted items, runes)</li><li><code>%CORAL%</code> &mdash; Coral (custom, Glide/HD Text only)</li><li><code>%SAGE%</code> &mdash; Sage (custom, Glide/HD Text only)</li><li><code>%TEAL%</code> &mdash; Teal (custom, Glide/HD Text only)</li><li><code>%LIGHT_GRAY%</code> &mdash; Light Gray (custom, Glide/HD Text only)</li></ul><p><strong>Note:</strong> CORAL, SAGE, TEAL, and LIGHT_GRAY only render correctly with Glide or HD Text enabled. Without these, they revert to the nearest standard color.</p>",
          "tags": ["color", "colors", "WHITE", "GRAY", "BLUE", "YELLOW", "GOLD", "GREEN", "DARK_GREEN", "TAN", "BLACK", "PURPLE", "RED", "ORANGE", "CORAL", "SAGE", "TEAL", "LIGHT_GRAY", "text color"]
        },
        {
          "id": "value-references",
          "question": "What value reference keywords can I use in output?",
          "answer": "<p>Value references insert dynamic item data into the output text. Common ones include:</p><ul><li><code>%NAME%</code> &mdash; Item's default name (modifiable via %CONTINUE%)</li><li><code>%BASENAME%</code> &mdash; Item's base name, stripped of quality and color</li><li><code>%ILVL%</code> &mdash; Item level</li><li><code>%ALVL%</code> &mdash; Affix level</li><li><code>%PRICE%</code> / <code>%SELLPRICE%</code> &mdash; Vendor sell price</li><li><code>%BUYPRICE%</code> &mdash; Vendor buy price</li><li><code>%SOCKETS%</code> &mdash; Socket count</li><li><code>%RUNENUM%</code> &mdash; Rune number (0-33)</li><li><code>%RUNENAME%</code> &mdash; Rune name without \"Rune\" suffix (e.g., \"Vex\" not \"Vex Rune\")</li><li><code>%GEMLEVEL%</code> &mdash; Gem quality (Chipped, Flawed, Normal, Flawless, Perfect)</li><li><code>%GEMTYPE%</code> &mdash; Gem type (Amethyst, Diamond, etc.)</li><li><code>%DEF%</code> &mdash; Total defense</li><li><code>%ED%</code> &mdash; Enhanced defense/damage</li><li><code>%MAXSOCKETS%</code> &mdash; Maximum possible sockets</li><li><code>%CODE%</code> &mdash; Item's 3-character code</li><li><code>%QTY%</code> &mdash; Quantity (for stackable items)</li><li><code>%WPNSPD%</code> &mdash; Weapon speed modifier</li><li><code>%RANGE%</code> &mdash; Melee range adder</li><li><code>%LVLREQ%</code> / <code>%REQLVL%</code> &mdash; Level requirement</li><li><code>%REQSTR%</code> / <code>%REQDEX%</code> &mdash; Strength/Dexterity requirements</li></ul><p>Any named attribute code or STAT# code also works as an output keyword: <code>%FCR%</code>, <code>%RES%</code>, <code>%STAT60%</code>, etc.</p>",
          "tags": ["value", "reference", "output", "keyword", "%ILVL%", "%ALVL%", "%PRICE%", "%SOCKETS%", "%RUNENUM%", "%RUNENAME%", "%DEF%", "%ED%", "%MAXSOCKETS%", "%CODE%", "%BASENAME%", "dynamic"]
        },
        {
          "id": "descriptions",
          "question": "How do item descriptions work?",
          "answer": "<p>Text inside <code>{}</code> (braces) appears as the item's <strong>description</strong> (shown below the name on hover), while text outside the braces is the item's <strong>name</strong>:</p><pre><code>// Name and description\nItemDisplay[]: %NAME%{Item Level: %ILVL%}\n\n// Show vendor price in description\nItemDisplay[]: %NAME%{%DARK_GREEN%$%PRICE%}</code></pre><p>Key behavior:</p><ul><li>Descriptions are <strong>independent</strong> of item visibility &mdash; a hidden item can still show a description</li><li>Use <code>%NL%</code> for new lines within descriptions (lines are built <strong>bottom-up</strong>)</li><li>Use <code>%CL%</code> for a conditional newline (does not create blank lines)</li><li><code>%CONTINUE%</code> must be placed <strong>outside</strong> the braces to work</li></ul><pre><code>// Multi-line description (bottom-up order!)\nItemDisplay[]: %NAME%{Affix Level: %ALVL%%NL%Item Level: %ILVL%}\n// Result:  Item Level: 87\n//          Affix Level: 85\n\n// CONTINUE with descriptions\nItemDisplay[]: %NAME%{Item Level: %ILVL%}%CONTINUE%\nItemDisplay[]: %NAME%{%NAME%, Affix Level: %ALVL%}</code></pre>",
          "tags": ["description", "braces", "{}", "tooltip", "%NL%", "%CL%", "newline", "bottom-up", "hover text", "description text"]
        },
        {
          "id": "character-limits",
          "question": "What are the character limits for names and descriptions?",
          "answer": "<p>Item names and descriptions have strict character limits:</p><h4>Item Names</h4><ul><li><strong>Displayed characters:</strong> 56 maximum</li><li><strong>Internal limit:</strong> 125 characters (includes color codes at 3 characters each, and %NL% at 2 characters each)</li><li>Example: 56 visible characters + 23 color keywords (69 internal chars) = 125 internal characters</li></ul><h4>Item Descriptions</h4><ul><li><strong>Total limit:</strong> 500 characters (same for both displayed and internal)</li></ul><h4>Color Cost</h4><p>Each color keyword (<code>%RED%</code>, <code>%BLUE%</code>, etc.) costs <strong>3 internal characters</strong> in item names. Plan your color usage accordingly &mdash; too many colors in a name will hit the 125 internal limit before the 56 displayed character limit.</p><p>The <code>%NL%</code> keyword costs <strong>2 internal characters</strong> per use in item names. Note that %NL% in item names only works for identified magic+ items, runewords, and shop items.</p>",
          "tags": ["character limit", "max length", "56", "125", "500", "internal", "displayed", "color cost", "3 characters", "name length", "description length", "truncated"]
        },
        {
          "id": "highlighting-items",
          "question": "How do I add highlighting (colored padding) around item names?",
          "answer": "<p>You can highlight items by adding <strong>spaces with a color keyword</strong> on either side of the name. However, whitespace at the edges of output is stripped, so you need a non-space character (like a tab or color keyword) at the boundary:</p><pre><code>// Add 1 space of orange highlighting on each side\nItemDisplay[RUNE&gt;9]: %ORANGE% %NAME% %ORANGE%</code></pre><p>Whitespace is stripped in this order: spaces first, then tabs. Tabs are often used as boundary characters because they don't display as visible characters but prevent space-stripping.</p><p>The amount of highlighting space you can add is limited by the character limits (56 displayed / 125 internal).</p>",
          "tags": ["highlight", "padding", "background", "border", "space", "tab", "colored", "emphasize", "stand out"]
        },
        {
          "id": "shop-price-color",
          "question": "How do I change the color of shop prices?",
          "answer": "<p>When viewing items in a merchant's shop, the price appears above the item name. You can recolor it by placing a color keyword <strong>at the end</strong> of the output:</p><pre><code>// Change shop price color to white\nItemDisplay[SHOP]: %NAME%%WHITE%</code></pre><p>The trailing color keyword sets the color for the price text that the game appends above the item name in shop windows.</p>",
          "tags": ["shop", "price", "merchant", "vendor", "color", "recolor", "shop price", "buy"]
        },
        {
          "id": "nl-keyword",
          "question": "How does %NL% work and what are its limitations?",
          "answer": "<p><code>%NL%</code> adds a new line and builds lines <strong>bottom-up</strong> (each %NL% pushes previous content up).</p><p><strong>In descriptions (inside braces):</strong> Works for all items.</p><p><strong>In item names (outside braces):</strong> Only works for:</p><ul><li>Identified items of magic quality or higher (<code>ID !NMAG</code>)</li><li>Runewords (<code>RW</code>)</li><li>Items in shops (<code>SHOP</code>)</li></ul><p><code>%CL%</code> is a conditional newline that works like %NL% but will not create blank lines or consecutive newlines. <code>%CS%</code> works similarly but for spaces.</p><pre><code>// Multi-line description (bottom-up!)\nItemDisplay[]: %NAME%{Line 2%NL%Line 1}\n// Displays:\n//   Line 1\n//   Line 2\n\n// Multi-line item name (only for ID magic+ items)\nItemDisplay[RARE ID]: Rare %BASENAME%%NL%%YELLOW%%NAME%</code></pre>",
          "tags": ["%NL%", "%CL%", "%CS%", "newline", "new line", "multi-line", "bottom-up", "line break", "description"]
        }
      ]
    },
    {
      "id": "notifications",
      "title": "Notifications",
      "questions": [
        {
          "id": "map-icons",
          "question": "How do I add minimap icons to items?",
          "answer": "<p>Use these keywords to create minimap icons when items drop. The <code>XX</code> is a 2-digit hexadecimal color code:</p><ul><li><code>%BORDER-XX%</code> &mdash; Large icon</li><li><code>%MAP-XX%</code> &mdash; Medium icon</li><li><code>%DOT-XX%</code> &mdash; Small icon</li><li><code>%PX-XX%</code> &mdash; Tiny (pixel) icon</li></ul><pre><code>// Large red icon for high runes\nItemDisplay[RUNE&gt;25]: %ORANGE%%NAME%%BORDER-62%\n\n// Medium green icon for set items\nItemDisplay[SET]: %GREEN%%NAME%%MAP-84%\n\n// Small blue icon for magic charms\nItemDisplay[MAG CHARM]: %NAME%%DOT-97%</code></pre><p><code>%MAP%</code> can be used without a color code &mdash; it will use the current text color (or white if none is set). Multiple icon keywords can be combined for multi-colored icons.</p><p>Common hex codes matching text colors: White=1F, Gray=C6, Blue=94, Yellow=6A, Gold=D3, Green=7D/84, Red=55/62, Orange=0B/60, Purple=9B.</p>",
          "tags": ["map icon", "minimap", "BORDER", "MAP", "DOT", "PX", "icon", "notification", "hex", "color code", "hexadecimal", "drop icon"]
        },
        {
          "id": "sound-notifications",
          "question": "How do I add drop sounds to items?",
          "answer": "<p>Use <code>%SOUNDID-#%</code> where <code>#</code> is the sound index from the game's sounds.txt file:</p><pre><code>// Play a PoE-inspired drop sound for unique items\nItemDisplay[UNI]: %GOLD%%NAME%%SOUNDID-4714%\n\n// Different sound for high runes\nItemDisplay[RUNE&gt;25]: %ORANGE%%NAME%%SOUNDID-4715%</code></pre><p>All sounds in sounds.txt are available except looping sounds. Use the in-game command <code>.playsound [sound-id]</code> to preview sounds.</p><p><strong>Path of Exile-inspired sounds:</strong> Indices <strong>4714-4729</strong> are custom PoE-style drop sounds added by PD2. These are the most commonly used for filter notifications.</p>",
          "tags": ["sound", "SOUNDID", "drop sound", "audio", "notification sound", "4714", "4715", "PoE sound", ".playsound", "alert"]
        },
        {
          "id": "text-notifications",
          "question": "How do text notifications work?",
          "answer": "<p>Text notifications appear on screen when an item drops. There are two systems:</p><h4>%NOTIFY-X% (legacy, not recommended)</h4><p>Only works when <strong>Detailed Notifications</strong> is disabled. The color codes 0-F map to: WHITE, RED, GREEN, BLUE, GOLD, GRAY, BLACK, TAN, ORANGE, YELLOW, DARK_GREEN, PURPLE, GREEN, WHITE, BLACK, WHITE.</p><ul><li><code>%NOTIFY-DEAD%</code> disables text notifications for the item</li></ul><p>Most filters are made for Detailed Notifications, making <code>%NOTIFY%</code> incompatible.</p><h4>%TIER-X% (recommended)</h4><p>Use <code>%TIER-0%</code> to disable text notifications while keeping minimap icons:</p><pre><code>// Map icon but no text notification\nItemDisplay[MAG CHARM]: %NAME%%DOT-97%%TIER-0%\n\n// Full notifications for runes 20+\nItemDisplay[RUNE&gt;19]: %ORANGE%%NAME%%MAP-0B%%TIER-9%</code></pre><p>If a rule has notification keywords but no <code>%TIER%</code>, it defaults to <code>%TIER-9%</code> (notifies at all filter levels).</p>",
          "tags": ["NOTIFY", "text notification", "TIER", "%TIER%", "%NOTIFY%", "NOTIFY-DEAD", "detailed notifications", "screen notification", "alert text"]
        },
        {
          "id": "notification-pass",
          "question": "Why do notifications apply regardless of rule position?",
          "answer": "<p>Notification keywords (<code>%BORDER%</code>, <code>%MAP%</code>, <code>%DOT%</code>, <code>%PX%</code>, <code>%SOUNDID%</code>, <code>%NOTIFY%</code>) bypass the normal top-to-bottom rule processing.</p><p>The game makes <strong>two separate passes</strong> through the filter:</p><ol><li><strong>First pass:</strong> Processes rules normally (top-to-bottom, first match wins). Notification keywords are <em>ignored</em>.</li><li><strong>Second pass:</strong> Processes <em>only</em> notification keywords. Everything else is ignored.</li></ol><p>This means a notification keyword in a rule at the bottom of your filter can still apply to an item that was matched by a different rule at the top. This is intentional but can cause unexpected behavior if you are not aware of it.</p><pre><code>// This rule matches first and displays the item\nItemDisplay[UNI]: %GOLD%%NAME%\n\n// But this notification ALSO applies (second pass)\nItemDisplay[UNI ELT]: %BORDER-D3%%SOUNDID-4714%</code></pre>",
          "tags": ["notification", "two pass", "second pass", "bypass", "separate pass", "regardless", "position", "order", "priority"]
        },
        {
          "id": "tier-threshold",
          "question": "How does %TIER-X% control when notifications appear?",
          "answer": "<p><code>%TIER-X%</code> sets the <strong>maximum filter level</strong> at which text notifications appear for an item. The value X can be 0-12:</p><ul><li><code>%TIER-0%</code> &mdash; No text notifications at any level (minimap icons still show)</li><li><code>%TIER-2%</code> &mdash; Text notifications only at filter level 2 or lower</li><li><code>%TIER-9%</code> &mdash; Text notifications at all levels (default if no TIER specified)</li><li><code>%TIER-12%</code> &mdash; Text notifications at all levels (max)</li></ul><pre><code>// Notify for unid magic charms only at strictness 2 or lower\nItemDisplay[MAG !ID cm1]: %NAME%%TIER-2%%DOT-97%\n\n// Always notify for high runes\nItemDisplay[RUNE&gt;25]: %ORANGE%%NAME%%BORDER-0B%%TIER-12%</code></pre><p>If a rule includes a notification keyword but no <code>%TIER%</code>, it defaults to <code>%TIER-9%</code>, meaning it notifies at all filter levels.</p>",
          "tags": ["TIER", "%TIER%", "threshold", "filter level", "notification level", "strictness", "when to notify", "TIER-0", "TIER-9"]
        },
        {
          "id": "combining-notifications",
          "question": "Can I combine multiple notification types on one item?",
          "answer": "<p>Yes. You can combine minimap icons, sounds, and tier thresholds in a single rule:</p><pre><code>// Large red border + PoE drop sound + notify at all levels\nItemDisplay[RUNE&gt;29]: %ORANGE%%NAME%%BORDER-62%%SOUNDID-4714%%TIER-12%\n\n// Medium green icon + small blue icon = multi-colored\nItemDisplay[SET ELT]: %GREEN%%NAME%%MAP-84%%DOT-97%\n\n// Map icon but no text notification\nItemDisplay[MAG CHARM]: %NAME%%DOT-97%%TIER-0%</code></pre><p>Multiple map icon keywords create multi-colored minimap icons. The icons layer on top of each other, allowing creative visual combinations.</p>",
          "tags": ["combine", "multiple", "notifications", "sound and icon", "multi-colored", "layer", "together"]
        }
      ]
    },
    {
      "id": "advanced-topics",
      "title": "Advanced Topics",
      "questions": [
        {
          "id": "continue-advanced",
          "question": "How can I use %CONTINUE% for complex layered filtering?",
          "answer": "<p><code>%CONTINUE%</code> replaces <code>%NAME%</code> with the current rule's output and continues checking. This enables powerful layered modifications:</p><pre><code>// Layer 1: Add socket count\nItemDisplay[SOCKETS&gt;0]: %NAME% %GRAY%[%SOCKETS%]%CONTINUE%\n\n// Layer 2: Add ethereal tag\nItemDisplay[ETH]: %GRAY%eth %NAME%%CONTINUE%\n\n// Layer 3: Add superior tag\nItemDisplay[SUP]: %GREEN%sup %NAME%%CONTINUE%\n\n// Layer 4: Final display\nItemDisplay[]: %NAME%</code></pre><p>A superior ethereal item with 4 sockets would build up as:</p><ol><li><code>%NAME%</code> = \"Colossus Voulge\"</li><li>After socket rule: <code>%NAME%</code> = \"Colossus Voulge [4]\"</li><li>After eth rule: <code>%NAME%</code> = \"eth Colossus Voulge [4]\"</li><li>After sup rule: <code>%NAME%</code> = \"sup eth Colossus Voulge [4]\"</li><li>Final rule displays it</li></ol><p><strong>Remember:</strong> <code>%CONTINUE%</code> must be <strong>outside</strong> description braces. It applies to both name and description content.</p>",
          "tags": ["%CONTINUE%", "continue", "layered", "chain", "build up", "multiple modifications", "advanced", "accumulate"]
        },
        {
          "id": "alias-toggles",
          "question": "How can I use aliases as toggle switches?",
          "answer": "<p>Aliases can act as boolean toggles by defining them as TRUE or FALSE (or any value you choose). This lets users easily customize filter behavior:</p><pre><code>// Toggle definitions at top of filter\nAlias[SHOW_NORMAL_GEMS]: FALSE\nAlias[SHOW_POTIONS]: TRUE\nAlias[HIDE_GOLD_UNDER]: 1000\n\n// Rules that use the toggles\nItemDisplay[NMAG MISC GEMLEVEL&lt;4 SHOW_NORMAL_GEMS]:\nItemDisplay[GOLD&lt;HIDE_GOLD_UNDER]:</code></pre><p>Since aliases are simple text replacement, <code>SHOW_NORMAL_GEMS</code> becomes <code>FALSE</code> in the condition. <code>FALSE</code> is not a valid condition code, so the rule never matches &mdash; effectively disabling it. If set to <code>TRUE</code>, the alias disappears and the rule works normally.</p><p>This pattern is widely used in community filters to let users customize behavior by changing a few values at the top of the file.</p>",
          "tags": ["alias", "toggle", "switch", "boolean", "TRUE", "FALSE", "customize", "configuration", "option", "setting"]
        },
        {
          "id": "filter-level-names",
          "question": "How do I define custom filter level names?",
          "answer": "<p>Use <code>ItemDisplayFilterName[]</code> at the top of your filter to define custom strictness levels:</p><pre><code>ItemDisplayFilterName[]: Leveling\nItemDisplayFilterName[]: Low Strictness\nItemDisplayFilterName[]: Medium Strictness\nItemDisplayFilterName[]: High Strictness\nItemDisplayFilterName[]: Ultra Strict</code></pre><p>The order determines the level number (first = level 1, second = level 2, etc.). Level 0 (Show All Items) is always available and cannot be customized. You can define up to <strong>12 custom levels</strong>.</p><p>Then use <code>FILTLVL</code> in conditions to make rules respond to the selected level:</p><pre><code>// Hide antidote potions at strictness 2+\nItemDisplay[yps FILTLVL&gt;1]:\n\n// Show runeword bases only at strictness 1\nItemDisplay[FILTLVL=1 NMAG !INF !RW SOCK=0]: %NAME% %GREEN%[RW Base]</code></pre><p>Rules without <code>FILTLVL</code> are not restricted by filter level &mdash; they apply at all levels.</p>",
          "tags": ["ItemDisplayFilterName", "filter level", "strictness", "custom level", "level name", "FILTLVL", "define levels"]
        },
        {
          "id": "mapid-maptier",
          "question": "How do MAPID and MAPTIER work?",
          "answer": "<p><code>MAPID</code> and <code>MAPTIER</code> let you create zone-specific filtering rules:</p><ul><li><code>MAPID</code> &mdash; The numeric ID of the current zone/map area</li><li><code>MAPTIER</code> &mdash; The tier of the current map (1, 2, or 3)</li></ul><pre><code>// Show extra info in Tier 3 maps\nItemDisplay[MAPTIER=3 RARE JEWELRY]: %NAME% %RED%!!!\n\n// Zone-specific filtering\nItemDisplay[MAPID=133 NMAG ARMOR]: %NAME% %GREEN%[Cows]</code></pre><p>The full list of MAPID values for each zone is on the <a href=\"https://wiki.projectdiablo2.com/wiki/Item_Filtering#MAPID_IDs\" target=\"_blank\">PD2 wiki</a>.</p><p><strong>Portal quirk:</strong> When entering a portal, items near the portal briefly show the <strong>previous zone's MAPID</strong> before updating. This can cause momentary incorrect displays for items near portals.</p>",
          "tags": ["MAPID", "MAPTIER", "zone", "area", "map", "tier", "zone-specific", "map tier", "location", "portal"]
        },
        {
          "id": "craftalvl-rerollalvl",
          "question": "How do CRAFTALVL and REROLLALVL help with crafting?",
          "answer": "<p>These codes predict what the affix level will be for crafted or rerolled items:</p><ul><li><code>CRAFTALVL</code> &mdash; What the ALVL would be if the <strong>current character</strong> uses this item as a crafting ingredient</li><li><code>REROLLALVL</code> &mdash; What the ALVL would be if the item is rerolled using a cube recipe</li></ul><pre><code>// Highlight items that would craft with max ALVL\nItemDisplay[MAG amu CRAFTALVL&gt;89]: %NAME% %GOLD%[Craft: alvl %CRAFTALVL%]\n\n// Show reroll ALVL in description\nItemDisplay[RARE JEWELRY]: %NAME%{Reroll alvl: %REROLLALVL%}</code></pre><p>Both are <strong>mutable codes</strong> &mdash; CRAFTALVL depends on your character's level, so it changes as you level up. REROLLALVL depends on the item's ilvl and can be displayed even without knowing the formula yourself.</p>",
          "tags": ["CRAFTALVL", "REROLLALVL", "crafting", "craft", "reroll", "affix level", "recipe", "cube", "alvl", "ingredient"]
        },
        {
          "id": "diff-code",
          "question": "How do I create difficulty-specific rules?",
          "answer": "<p>Use <code>DIFF</code> to check the current game difficulty:</p><ul><li><code>DIFF=0</code> &mdash; Normal</li><li><code>DIFF=1</code> &mdash; Nightmare</li><li><code>DIFF=2</code> &mdash; Hell</li></ul><pre><code>// Hide low gold only in Hell\nItemDisplay[DIFF=2 GOLD&lt;5000]:\n\n// Show all items in Normal (helpful for new characters)\nItemDisplay[DIFF=0]: %NAME%\n\n// Stricter filtering in Nightmare+\nItemDisplay[DIFF&gt;0 NMAG NORM]:</code></pre><p><code>DIFF</code> is a mutable code &mdash; it changes based on the difficulty of the game you are currently in.</p>",
          "tags": ["DIFF", "difficulty", "normal", "nightmare", "hell", "difficulty-specific", "game difficulty"]
        },
        {
          "id": "prefix-suffix-advanced",
          "question": "Why should I use ~ (between) for PREFIX and SUFFIX instead of < or >?",
          "answer": "<p>The <code>&lt;</code> and <code>&gt;</code> operators are <strong>unreliable</strong> with PREFIX and SUFFIX codes. Always use the between operator (<code>~</code>) for matching specific affix IDs:</p><pre><code>// CORRECT: Use between operator\nItemDisplay[MAG SUFFIX~90-90]: %NAME% %BLUE%[Whale]\n\n// INCORRECT: Less-than/greater-than are unreliable\nItemDisplay[MAG SUFFIX=90]: %NAME% %BLUE%[Whale]  // may not work as expected\nItemDisplay[MAG SUFFIX&gt;89 SUFFIX&lt;91]: %NAME%     // unreliable</code></pre><p>To check for a single specific prefix or suffix, use <code>~X-X</code> (same number on both sides). For a range of affixes, use <code>~X-Y</code>.</p><p>The same applies to <code>AUTOMOD</code> codes for class item auto-modifiers.</p>",
          "tags": ["PREFIX", "SUFFIX", "between", "tilde", "~", "unreliable", "less than", "greater than", "affix", "AUTOMOD"]
        },
        {
          "id": "filtlvl-rules",
          "question": "How do FILTLVL conditions interact with rules that don't use them?",
          "answer": "<p>Rules without <code>FILTLVL</code> in their conditions are <strong>not affected</strong> by the selected filter level &mdash; they always apply regardless of which level is active. Only rules that explicitly check <code>FILTLVL</code> are gated:</p><pre><code>// This rule ALWAYS applies (no FILTLVL check)\nItemDisplay[RUNE&gt;25]: %ORANGE%%NAME%%BORDER-0B%\n\n// This rule only applies at level 2+\nItemDisplay[yps FILTLVL&gt;1]:\n\n// This rule only applies at exactly level 1\nItemDisplay[FILTLVL=1 NMAG NORM]:</code></pre><p>For notifications: if a rule includes a notification keyword but no <code>%TIER%</code> keyword, it defaults to <code>%TIER-9%</code> &mdash; meaning it will notify at all filter levels. Explicitly include <code>%TIER-X%</code> to control when notifications appear.</p>",
          "tags": ["FILTLVL", "filter level", "always apply", "gated", "conditional", "strictness", "level check"]
        }
      ]
    },
    {
      "id": "troubleshooting",
      "title": "Troubleshooting",
      "questions": [
        {
          "id": "filter-not-working",
          "question": "My filter is not working at all. What should I check?",
          "answer": "<p>Work through this checklist:</p><ol><li><strong>Enable Loot Filter</strong> must be turned on in PD2 Options (in-game settings)</li><li><strong>File extension:</strong> Make sure your file is <code>.filter</code>, not <code>.filter.txt</code> or <code>.txt</code>. Windows often hides extensions &mdash; enable \"Show file extensions\" in File Explorer to verify.</li><li><strong>File location:</strong> If using the launcher, select the filter from the launcher. If manual, place it in <code>ProjectD2\\filters\\local\\</code> and select it from the Local tab.</li><li><strong>Reload the filter:</strong> Press <strong>Numpad 0</strong> (default hotkey) after making changes.</li><li><strong>Save and close:</strong> Make sure you saved the file and closed the editor before reloading.</li><li><strong>Correct PD2 installation:</strong> Make sure you are editing the filter in the right PD2 directory (not a duplicate installation).</li></ol>",
          "tags": ["not working", "broken", "doesn't work", "filter broken", "no effect", "troubleshoot", "debug", "fix", "check"]
        },
        {
          "id": "common-file-naming",
          "question": "What are common file naming mistakes?",
          "answer": "<p>These are the most frequent file naming errors that prevent filters from loading:</p><ul><li><code>loot.filter.filter</code> &mdash; Double extension (renamed an already-named file)</li><li><code>loot.filter.txt</code> &mdash; Hidden .txt extension added by Windows Notepad</li><li><code>loot.txt</code> &mdash; Wrong extension entirely</li><li><code>default.filter.filter</code> &mdash; Same double-extension problem</li></ul><p><strong>How to fix:</strong></p><ol><li>Open File Explorer and go to <strong>View</strong> &rarr; check <strong>File name extensions</strong></li><li>Look at the actual full filename</li><li>Rename to remove any extra extensions</li></ol><p><strong>Tip:</strong> When using Notepad's \"Save As\", change \"Save as type\" to \"All Files (*.*)\" before saving. Otherwise Notepad appends <code>.txt</code> automatically.</p>",
          "tags": ["file name", "naming", "extension", ".filter.txt", ".filter.filter", ".txt", "wrong name", "rename", "Windows", "hidden extension", "Notepad"]
        },
        {
          "id": "items-disappearing",
          "question": "Why are items disappearing from the ground?",
          "answer": "<p>If items are vanishing, your filter is <strong>hiding them</strong> with empty output rules. Common causes:</p><ul><li>A broad rule like <code>ItemDisplay[NMAG]:</code> is hiding all non-magic items</li><li>Rules are in the wrong order and a general hide rule matches before a specific show rule</li><li>A catch-all <code>ItemDisplay[]:</code> with empty output is hiding everything not matched above</li></ul><p><strong>Quick fix:</strong> Switch to <strong>Filter Level 0 (Show All Items)</strong> in PD2 Options. This overrides all hiding rules and shows every item.</p><p><strong>To diagnose:</strong> Look through your filter for rules with empty output (nothing after the colon). Check if the conditions match the items you're missing. Remember that rules are processed top-to-bottom &mdash; the first match wins.</p>",
          "tags": ["disappearing", "missing", "invisible", "hidden", "gone", "can't see", "vanished", "items gone", "empty output", "show all"]
        },
        {
          "id": "notifications-not-showing",
          "question": "Why are my notifications (sounds/map icons) not appearing?",
          "answer": "<p>Check these common causes:</p><ol><li><strong>%TIER-X% too low:</strong> If the rule has <code>%TIER-0%</code>, text notifications are disabled at all levels except level 0. Map icons still show, but there's no text/sound alert.</li><li><strong>Default TIER-9:</strong> Rules with notification keywords but no explicit <code>%TIER%</code> default to <code>%TIER-9%</code>, which works at all levels. But if the filter has more than 9 custom levels, higher levels won't see notifications.</li><li><strong>Detailed Notifications:</strong> <code>%NOTIFY%</code> only works with Detailed Notifications <strong>disabled</strong>. Most filters expect it enabled. Use <code>%TIER%</code> and map icons instead.</li><li><strong>Sound issues:</strong> Test sounds with <code>.playsound [id]</code> in-game chat. Make sure your sound ID is valid.</li><li><strong>Drop Notifications setting:</strong> Make sure Drop Notifications is enabled in PD2 Options.</li></ol>",
          "tags": ["notification", "sound", "map icon", "not showing", "not working", "no sound", "no icon", "TIER", "NOTIFY", "missing notification"]
        },
        {
          "id": "old-filter-issues",
          "question": "My filter from last season is behaving strangely. Why?",
          "answer": "<p>Filters from previous seasons will almost certainly behave incorrectly because:</p><ul><li><strong>New items:</strong> New bases, uniques, sets, and PD2 items are added each season with new codes that old filters don't know about</li><li><strong>Changed items:</strong> Some items are reworked, renamed, or have their codes changed</li><li><strong>Balance changes:</strong> Items that were valuable may no longer be, and vice versa</li><li><strong>New filter features:</strong> New syntax features may be available that improve filtering</li></ul><p><strong>Solution:</strong> Always use a filter updated for the current season. If you want to keep your customizations, start with an updated community filter and re-apply your changes to it.</p>",
          "tags": ["old filter", "previous season", "last season", "outdated", "strange", "wrong", "weird", "bugs", "incorrect", "broken"]
        },
        {
          "id": "rune-color-baked",
          "question": "Why can't I change the color of rune names?",
          "answer": "<p>Runes have their default color (orange) <strong>baked into %NAME%</strong>. Placing a color keyword before <code>%NAME%</code> will not change the color:</p><pre><code>// Does NOT change color (orange is embedded in %NAME%):\nItemDisplay[r33]: %RED%%NAME%     // Still shows as orange\n\n// DOES change color (name is rewritten entirely):\nItemDisplay[r33]: %RED%Zod Rune    // Shows as red</code></pre><p>This applies to runes, Standard of Heroes, and most PD2-specific non-equipment items (except map/arena scrolls and jewel fragments). This is likely <a href=\"https://wiki.projectdiablo2.com/wiki/Bugs\" target=\"_blank\">unintended behavior</a>.</p><p>To change a rune's color, you must rewrite the name. You can use <code>%RUNENAME%</code> to get the rune name without \"Rune\":</p><pre><code>// Rewrite rune name in red\nItemDisplay[RUNE&gt;25]: %RED%%RUNENAME% Rune</code></pre>",
          "tags": ["rune", "color", "baked", "embedded", "%NAME%", "orange", "can't change", "rune color", "rewrite", "RUNENAME"]
        },
        {
          "id": "ansi-encoding",
          "question": "When do I need ANSI encoding instead of UTF-8?",
          "answer": "<p>Most filter files work fine with the default UTF-8 encoding. You only need <strong>ANSI encoding</strong> if you use special characters from the Latin-1 Supplement Unicode block:</p><ul><li>Symbols: <code>&micro;&para;&cent;&pound;&yen;&reg;&copy;&sect;&iquest;&iexcl;</code> and more</li><li>Accented capitals: <code>&ETH;&THORN;&AElig;&Oslash;&Aacute;&Agrave;&Acirc;&Auml;</code> etc.</li><li>Accented lowercase: <code>&eth;&thorn;&aelig;&oslash;&aacute;&agrave;&acirc;&auml;</code> etc.</li></ul><p>If these characters display as garbled text or question marks in-game, switch your file to ANSI encoding in your text editor:</p><ul><li><strong>Notepad++:</strong> Encoding menu &rarr; Convert to ANSI</li><li><strong>VS Code:</strong> Click the encoding in the status bar &rarr; Save with Encoding &rarr; Western (Windows 1252)</li></ul>",
          "tags": ["ANSI", "encoding", "UTF-8", "special characters", "garbled", "question marks", "Latin-1", "character encoding", "Notepad++"]
        },
        {
          "id": "hd-text-issues",
          "question": "Why do some characters not display correctly with HD Text?",
          "answer": "<p>HD Text has different character support compared to the classic text renderer:</p><ul><li><strong>Characters that show as \"?\" without HD Text:</strong> <code>&middot;&cedil;</code></li><li><strong>Characters that don't display at all with HD Text:</strong> <code>&not;&shy;&divide;&plusmn;&curren;</code> (including the soft hyphen character)</li></ul><p>If you are using custom symbols in your filter, test with both HD Text on and off to ensure compatibility. The four custom colors (<code>%CORAL%</code>, <code>%SAGE%</code>, <code>%TEAL%</code>, <code>%LIGHT_GRAY%</code>) also require Glide or HD Text &mdash; without it, they fall back to the nearest standard color.</p><p>When designing filters for public use, stick to standard characters and the 12 non-custom colors for maximum compatibility.</p>",
          "tags": ["HD Text", "Glide", "characters", "display", "compatibility", "not showing", "question mark", "CORAL", "SAGE", "TEAL", "LIGHT_GRAY", "renderer"]
        },
        {
          "id": "mapid-portal-quirk",
          "question": "Why do items near portals briefly show wrong filter behavior?",
          "answer": "<p>When you enter a portal, items near the portal entrance briefly display using the <strong>previous zone's MAPID</strong> before updating to the correct zone. This is a known quirk.</p><p>For example, if you have <code>MAPID</code>-based rules that show extra info only in certain maps, items near a portal you just entered may momentarily show the wrong info (from the zone you just left).</p><p>This is a brief visual glitch and resolves quickly. There is no workaround &mdash; it is a limitation of how the game handles zone transitions. It only affects rules that use <code>MAPID</code> in their conditions.</p>",
          "tags": ["MAPID", "portal", "quirk", "bug", "glitch", "wrong zone", "briefly", "transition", "zone change"]
        },
        {
          "id": "special-codes-gotcha",
          "question": "Why doesn't my filter match Cage of the Unsullied, Band of Skulls, or The Third Eye?",
          "answer": "<p>These PD2-unique items use <strong>special item codes</strong> that override their base item codes:</p><ul><li><strong>Cage of the Unsullied</strong> uses code <code>rar</code> (not <code>uhn</code> for Boneweave)</li><li><strong>Band of Skulls</strong> uses code <code>rbe</code> (not <code>utc</code> for Mithril Coil)</li><li><strong>The Third Eye</strong> uses code <code>ram</code> (not <code>amu</code> for Amulet)</li></ul><p>If your filter targets <code>uhn</code>, <code>utc</code>, or <code>amu</code>, these special uniques will <strong>not</strong> match. You need to add their special codes:</p><pre><code>// Match both regular Boneweaves and Cage of the Unsullied\nItemDisplay[(uhn OR rar)]: %NAME%\n\n// Match all amulets including The Third Eye\nItemDisplay[(amu OR ram)]: %NAME%</code></pre>",
          "tags": ["rar", "rbe", "ram", "Cage of the Unsullied", "Band of Skulls", "The Third Eye", "special code", "not matching", "doesn't match", "missing unique"]
        }
      ]
    }
  ]
}
;