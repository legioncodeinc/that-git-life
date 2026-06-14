#!/bin/bash
# Automatically symlinks newly created .claude/skills/<name>/ folders into
# .cursor/skills/<name> so Cursor can discover them as agent skills.
#
# Fires as a postToolUse hook on Write events. Runs from the project root.

set -euo pipefail

input=$(cat)

# Extract the written file path from the Write tool input.
file_path=$(echo "$input" | jq -r '.tool_input.path // empty' 2>/dev/null)

if [[ -z "$file_path" ]]; then
  exit 0
fi

project_root="$(pwd)"
claude_skills_dir="$project_root/.claude/skills"
cursor_skills_dir="$project_root/.cursor/skills"

# Normalise: if path is relative, make it absolute relative to project root.
if [[ "$file_path" != /* ]]; then
  file_path="$project_root/$file_path"
fi

# Bail early if the file is not under .claude/skills/.
if [[ "$file_path" != "$claude_skills_dir/"* ]]; then
  exit 0
fi

# Extract the skill name: first path segment after .claude/skills/.
remainder="${file_path#$claude_skills_dir/}"
skill_name="${remainder%%/*}"

if [[ -z "$skill_name" ]]; then
  exit 0
fi

claude_skill_dir="$claude_skills_dir/$skill_name"
cursor_skill_link="$cursor_skills_dir/$skill_name"

# Only act when the source directory exists and the link target does not.
if [[ -d "$claude_skill_dir" ]] && [[ ! -e "$cursor_skill_link" ]]; then
  # Use a relative target so the repo stays portable.
  ln -sfn "../../.claude/skills/$skill_name" "$cursor_skill_link"
fi

exit 0
