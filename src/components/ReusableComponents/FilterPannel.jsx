export default function FilterPannel({ onFilterChange, currentFilter }) {
  return (
    <>
      <div className="filterContent">
        <label htmlFor="filetrPosts">Filter by :</label>
        <select
          id="filetrPosts"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="newFirst">Most recent</option>
          <option value="oldFirst">Oldest</option>
        </select>
      </div>
    </>
  );
}
