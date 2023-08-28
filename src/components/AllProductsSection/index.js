import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusList = {
  success: 'Success',
  failure: 'Fail',
  process: 'Process',
  initial: 'Initial',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategory: categoryOptions[0].categoryId,
    activeRating: '',
    apiStatus: apiStatusList.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusList.process,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategory,
      activeRating,
      searchInput,
    } = this.state
    console.log(activeCategory)
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategory}&rating=${activeRating}&title_search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  changeTheCategory = id => {
    this.setState({activeCategory: id}, this.getProducts)
  }

  clearTheFilter = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        searchInput: '',
        activeCategory: categoryOptions[0].categoryId,
        activeRating: '',
        apiStatus: apiStatusList.initial,
      },
      this.getProducts,
    )
  }

  changeTheRating = id => {
    this.setState({activeRating: id}, this.getProducts)
  }

  changeTheSearchInputBy = searchValue => {
    this.setState({searchInput: searchValue}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state
    const ProductsHasToShow = productsList.length > 0
    // Todo process the no product view
    return ProductsHasToShow ? (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-product-found">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          alt="no products"
          className="failure-product-image"
        />
        <h1>No Product Found</h1>
        <p>We could not find any products. Try other filters.</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderTheFailureView = () => (
    <div className="no-product-found">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-product-image"
      />
      <h1>Opps! Something Went Wrong</h1>
      <p>
        We are having some trouble processing your request <br /> please try
        again{' '}
      </p>
    </div>
  )

  renderTheAllProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderProductsList()
      case apiStatusList.process:
        return this.renderLoader()
      case apiStatusList.failure:
        return this.renderTheFailureView()
      default:
        return null
    }
  }

  render() {
    const {apiStatus, searchInput, activeCategory} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          changeTheSearchInputBy={this.changeTheSearchInputBy}
          searchInput={searchInput}
          changeTheCategory={this.changeTheCategory}
          activeCategory={activeCategory}
          clearTheFilter={this.clearTheFilter}
          changeTheRating={this.changeTheRating}
        />

        {this.renderTheAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
