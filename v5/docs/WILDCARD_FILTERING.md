# Wildcard Filtering Guide

## Overview
All text filter boxes in the Users and Map Points tables now support **wildcard pattern matching** and **OR logic**, similar to the SQL `LIKE` operator with multiple conditions.

## Wildcard Syntax

Use the asterisk `*` as a wildcard character that matches any sequence of characters (including zero characters).

## OR Operator

Combine multiple patterns using `|` or the word `or` (case-insensitive):
- `a*|b*` - matches items starting with "a" OR "b"
- `a* or b*` - same as above (spaces around "or" are optional)
- `pending|hidden` - matches "pending" OR "hidden"
- `*park*|*garden*` - matches items containing "park" OR "garden"

### Pattern Examples

| Pattern | Description | Matches | Doesn't Match |
|---------|-------------|---------|---------------|
| `P*` | Starts with "P" | Pending, Park, Paul | Hidden, Found |
| `*den` | Ends with "den" | Hidden, Garden, Iden | Pending, Found |
| `*und*` | Contains "und" | Found, Underground, Foundation | Pending, Hidden |
| `h*n` | Starts with "h", ends with "n" | Hidden, Helen, Haitian | Found, Bob |
| `a*\|b*` | Starts with "a" OR "b" | Alice, Bob, Adam, Betty | Charlie, David |
| `a* or b*` | Same as above | Alice, Bob, Adam | Charlie |
| `pending\|hidden` | Exact match for either | pending, hidden | found |
| `p*\|h*\|f*` | Starts with p, h, OR f | Pending, Hidden, Found | active |
| `*` | Matches everything | All records | (none) |
| `alice` | Contains "alice" (no wildcard) | Alice, alice123, malice | bob, charlie |

## Column Support

### Users Table (Details View)
- **Username**: e.g., `a*` finds all usernames starting with "a"
- **Name**: e.g., `*smith` finds all names ending with "smith"
- **Role**: e.g., `*admin*` finds all users with admin role

### Users Table (Compact View)
- **User**: Searches across username, name, AND roles with wildcard support
  - Example: `*admin*` finds users with admin role OR admin in their name

### Map Points Table (Details View)
- **Title**: e.g., `Park*` finds all points starting with "Park"
- **User**: e.g., `alice*` finds all points by users starting with "alice"
- **Status**: e.g., `p*` finds "pending", `h*` finds "hidden", `f*` finds "found"
- **Found By**: e.g., `bob*` finds all points found by users starting with "bob"

### Map Points Table (Compact View)
- **Point**: Searches across title, username, status, foundBy, AND coordinates
  - Example: `*park*` might match titles with "park", status, or usernames

## Case Sensitivity

All wildcard matching is **case-insensitive**:
- `p*` matches "Pending", "Park", "pending"
- `*HIDDEN*` matches "hidden", "Hidden", "HIDDEN"

## Fallback Behavior

If you don't use any wildcards (`*`), the filter falls back to simple **substring matching**:
- Typing `alice` will match "alice", "Alice", "malice", "alice123"
- This is the same as typing `*alice*`

## Examples

### Find all pending OR hidden points:
- Status column: `p*|h*` or `pending|hidden` or `p* or h*`

### Find all points by Alice OR Bob:
- User column: `alice|bob` or `alice or bob`

### Find points starting with "Park" OR "Garden":
- Title column: `Park*|Garden*` or `park* or garden*`

### Find all users with admin OR moderator role:
- Role column: `*admin*|*mod*` or `*admin* or *mod*`

### Find multiple specific usernames:
- Username column: `alice|bob|charlie` or `alice or bob or charlie`

### Combine wildcards with OR:
- Status column: `p*|h*|f*` matches pending, hidden, found
- Title column: `*park*|*beach*|*mountain*` matches any title containing those words

## Technical Details

The wildcard filter converts patterns to regular expressions:
- `*` is converted to `.*` (regex for "any characters")
- `|` or ` or ` splits patterns into OR conditions
- Each pattern is tested independently - if ANY match, the row is shown
- Other special regex characters are escaped
- Pattern is anchored with `^` and `$` for exact matching
- Case-insensitive flag (`i`) is applied

## Limitations

- Only the `*` wildcard is supported (not `?` for single character)
- No support for escape sequences
- No support for AND operator within a single filter box (use multiple column filters for AND logic)
- No support for NOT operator
- To combine filters across columns, use multiple column filters simultaneously (they work as AND)
