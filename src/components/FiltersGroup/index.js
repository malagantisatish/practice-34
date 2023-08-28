import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const searchingTheProduct = event => {
    const {changeTheSearchInputBy} = props
    changeTheSearchInputBy(event.target.value)
  }
  const renderTheSearchInputContainer = () => {
    const {searchInput} = props
    return (
      <div className="search-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          onChange={searchingTheProduct}
        />
        <BsSearch className="search-icon" />
      </div>
    )
  }

  const renderTheCategoryList = () => {
    const {categoryOptions, activeCategory} = props
    return categoryOptions.map(category => {
      const {changeTheCategory} = props
      const onClickedOnCategory = () => {
        changeTheCategory(category.categoryId)
      }
      const isActive = activeCategory === category.categoryId
      const classNameForCategory = isActive ? 'active-class' : 'inactive-class'
      return (
        <li
          key={category.categoryId}
          onClick={onClickedOnCategory}
          className="category-items"
        >
          <p className={classNameForCategory}>{category.name}</p>
        </li>
      )
    })
  }

  const renderTheCategory = () => {
    const {categoryOptions} = props
    return <ul className="category-list">{renderTheCategoryList()}</ul>
  }

  const renderTheRatingList = () => {
    const {ratingsList} = props
    return (
      <li>
        {ratingsList.map(rating => {
          const {changeTheRating} = props
          const clickedOnRatingBtn = () => {
            changeTheRating(rating.ratingId)
          }
          return (
            <li
              key={rating.ratingId}
              className="rating-item"
              onClick={clickedOnRatingBtn}
            >
              <img
                src={rating.imageUrl}
                alt={`rating ${rating.ratingId}`}
                className="star-image"
              />
              <p>&up</p>
            </li>
          )
        })}
      </li>
    )
  }

  const renderTheRating = () => (
    <div>
      <h1>Rating</h1>
      <ul className="stars-list">{renderTheRatingList()}</ul>
    </div>
  )

  const clickedOnClearBtn = () => {
    const {clearTheFilter} = props
    clearTheFilter()
  }
  return (
    <div>
      {renderTheSearchInputContainer()}
      <h1>Category</h1>
      {renderTheCategory()}
      {renderTheRating()}
      <button
        type="button"
        className="clear-button"
        onClick={clickedOnClearBtn}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
