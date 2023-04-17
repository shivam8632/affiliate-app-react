import React, {useState, useEffect, useContext} from 'react';
import UserContext from '../context/UserContext';
import './pages.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API } from '../../config/Api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

const CreateCampaign = () => {
    const [productName, setProductName] = useState([]);
    const [productIds, setProductIds] = useState([]);
    const [influencerList, setInfluencerList] = useState([]);
    const [campaignName, setCampaignName] = useState('');
    const [selectedDate, setSelectedDate] = useState("");
    const [influencerVisit, setInfluencerVisit] = useState('');
    const [showList, setShowList] = useState(false);
    const [campaignDesc, setCampaignDesc] = useState('');
    const [influenceOffer, setInfluenceOffer] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState({ name: "", product: "" });
    const [prodList, setProdList] = useState('')
    const [loading, setLoading] = useState(false);
    const [productUrl, setProductUrl] = useState([]);
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [prevCouponClicked, setPrevCouponClicked] = useState('');
    const [couponClicked, setCouponClicked] = useState('');
    const [selectedCouponNames, setSelectedCouponNames] = useState([]);
    const [selectedCouponAmounts ,setSelectedCouponAmounts] = useState([]);
    const [isVisitChecked, setIsVisitChecked] = useState(false);
    const [isOfferChecked, setIsOfferChecked] = useState(false);
    const { setMarketId, setMarketList,setMarketDraftId, setMarketDraftList, countCamp, setCountCamp} = useContext(UserContext);
    const token = localStorage.getItem("Token");
    const [productDetails, setProductDetails] = useState([]);
  
    const today = new Date().toISOString().substr(0, 10);

    const handleCampDesc = (event) => {
        setCampaignDesc(event.target.value);
    }

    const handleCampaignNameChange = (event) => {
        setCampaignName(event.target.value);
    }

    const handleInfluencerVisit = (event) => {
        setInfluencerVisit(event.target.value);
        setIsVisitChecked(!isVisitChecked)
    }

    const handleInfluenceOffer = (e) => {
        setInfluenceOffer(e.target.value);
        setIsOfferChecked(!isOfferChecked)
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    }

    useEffect(() => {
        axios.get(API.BASE_URL + 'product/list/',{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Product List", response);
            setProdList(response.data.success.products)
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get(API.BASE_URL + 'influencer/list/',{
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Influencer List", response.data.data);
            setInfluencerList(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
    }, [token])

    const countList = () => {
        axios.get(API.BASE_URL + 'count/',{
            headers: {
                Authorization: 'Token ' + localStorage.getItem('Token')
            }
        })
        .then(function (response) {
            console.log("Count List in New", response);
            setCountCamp(response.data);
            console.log(countCamp)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    const createNewCampaignDraft = (e) => {  
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'create/', {
            product: productIds.toString(),
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            offer: influenceOffer,
            product_discount: selectedCouponAmounts,
            influencer_visit: influencerVisit
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Campaign Saved in Draft", response);
            toast.success("Campaign Saved in Draft!");
            setProductName([]);
            setCampaignName('');
            setSelectedDate('');
            setInfluenceOffer('');
            setInfluencerVisit('');
            setCampaignDesc('')
            setProductIds([]);
            setSelectedCoupon('')
            setProductDetails([])
            setProductUrl([])
            countList()
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            axios.get(API.BASE_URL + 'markdraft/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                setMarketDraftList(response.data.data);
                setMarketDraftId(response.data.product_id);
            })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.");
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.");
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.");
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.");
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.");
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.");
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.");
            }
            
            else {
                toast.warn("Request failed. Please try again later");
            }
        })
        .finally(() => setLoading(false));
    }

    const createNewCampaign = (e) => {  
        setLoading(true);
        e.preventDefault();
        axios.post(API.BASE_URL + 'markplace/camp', {
            product: productIds.toString(),
            campaign_name: campaignName,
            date: selectedDate,
            coupon: selectedCouponNames.toString(),
            offer: influenceOffer,
            product_discount: selectedCouponAmounts,
            influencer_visit: influencerVisit
        }, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(function (response) {
            console.log("Created New Campaign", response);
            toast.success("New Campaign Created!");
            setProductName([]);
            setCampaignName('');
            setSelectedDate('');
            setInfluenceOffer('');
            setInfluencerVisit('');
            setProductIds([])
            setCampaignDesc('');
            setSelectedCoupon('')
            setProductDetails([])
            setIsVisitChecked(false);
            setIsOfferChecked(false);
            axios.get(API.BASE_URL + 'market/list/',{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(function (response) {
                setMarketList(response.data.data);
                setMarketId(response.data.product_id);
            })
            .catch(function (error) {
                console.log(error);
            })
            countList()
        })
        .catch(function (error) {
            console.log(error);
            if(error.response.data.campaign_name) {
                toast.warn("Campaign Name may not be blank.");
            }
            else if(error.response.data.influencer_visit) {
                toast.warn("Influencer Visit may not be blank.");
            }
            else if(error.response.data.date) {
                toast.warn("Date may not be blank.");
            }
            else if(error.response.data.offer) {
                toast.warn("Offer may not be blank.");
            }
            else if(error.response.data.product) {
                toast.warn("Please selecta any Product.");
            }
            else if(error.response.data.product_discount) {
                toast.warn("Please select any value of Product Discount.");
            }
            else if(error.response.data.coupon) {
                toast.warn("Coupon may not be blank.");
            }
            
            else {
                toast.warn("Request failed. Please try again later");
            }
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, [token]);

    const handleClickOutside = (event) => {
        const input = document.querySelector(".test input");
        const list = document.querySelector(".test ul");
        if (!input?.contains(event.target) && !list?.contains(event.target)) {
          setShowList(false);
        }
    };

    useEffect(() => {
        if (Array.isArray(productName)) {
            Promise.all(
                productName?.map((product) => {
                    setLoading(true);
                    return axios
                    .post(API.BASE_URL + "product/url/", {
                        products: productIds.toString()
                    }, {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    })
                    .then((response) => {
                        console.log("Response 1",response);
                        setProductDetails(response.data.product_details);
                        setProductUrl(response.data.product_url)
                    })
                    .catch((error) => console.log(error))
                    .finally(() => setLoading(false));
                })
            ).finally(() => setLoading(false));
        }
    }, [productName, token]);

    useEffect(() => {
        setPrevCouponClicked(couponClicked);
    }, [couponClicked, selectedCoupon]);


  return (
    <div className="campaign-new p-4 page">
        {loading && <div className='loader'><span></span></div>}
        <div className="campaign-new-container d-flex flex-column justify-content-center align-items-center">
            <h3 className='my-5'>Create Campaign for Marketplace</h3>
            <Link to='/create' className={"button button-blue d-flex me-auto back"}>
                <FontAwesomeIcon icon={faChevronLeft} style={{ color: "#000", width: "15px", height: "15px", marginRight: 5 }} />
                Back
            </Link>
            <form action="" className='d-flex flex-wrap justify-content-between mt-5'>
                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign name</label>
                    <input type="text"  onChange={handleCampaignNameChange} value={campaignName} />
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Influencer need to visit you</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="yes" name="influencerVisit" value="Yes" checked={influencerVisit === "Yes"} onChange={handleInfluencerVisit} />
                            <label htmlFor="yes">Yes</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="no" name="influencerVisit" value="No" checked={influencerVisit === "No"} onChange={handleInfluencerVisit} />
                            <label htmlFor="no">No</label>
                        </span>
                    </div>
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Campaign date or range</label>
                    <input type="date" min={today} onChange={handleDateChange} value={selectedDate} />
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Offer to influencers</label>
                    <div className="input d-flex align-items-center">
                        <span className='d-flex align-items-center justify-content-center me-4'>
                            <input type="radio" id="percentage" name="influenceOffer" value="percentage" checked={influenceOffer === "percentage"} onChange={handleInfluenceOffer} />
                            <label htmlFor="percentage">Percentage</label>
                        </span>
                        <span className='d-flex align-items-center justify-content-center'>
                            <input type="radio" id="commission" name="influenceOffer" value="commission" checked={influenceOffer === "commission"} onChange={handleInfluenceOffer} />
                            <label htmlFor="commission">Commission</label>
                        </span>
                    </div>
                </div>

                <div className="input-container test d-flex flex-column mb-4 drop">
                    <label className="mb-3">Product</label>
                    <input
                    type="text"
                    placeholder="---Select an option---"
                    onClick={() => setShowList(!showList)}
                    value={productName}
                    />
                    {showList && (
                    <ul className='product-list'>
                    {
                        prodList?.length > 0 ? (
                            prodList?.map((name, i) => (
                                <li
                                    key={i}
                                    onClick={() => {
                                    setProductName((prevValues) =>
                                        prevValues.includes(name.title)
                                        ? prevValues.filter((value) => value !== name.title)
                                        : [...prevValues, name.title]
                                    );
                                    setProductIds(prevIds =>
                                        prevIds.includes(name.id)
                                            ? prevIds.filter(value => value !== name.id)
                                            : [...prevIds, name.id]
                                    );
                                    setShowList(false);
                                    }}
                                >
                                    {name.title}
                                </li>
                                ))
                        )
                        :
                        "No Products"
                    }
                </ul>
                    )}
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Product URL</label>
                    {productIds.length > 0 ? (
                        <div className='product-urls'>
                            {productUrl?.map((url, index) => (
                                <a key={index} href={url} target="_blank">
                                    <FontAwesomeIcon icon={faSearch} style={{ color: "#5172fc", width: "15px", height: "15px", marginRight: 10 }} />
                                    {url}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className='no-url'>No products selected.</p>
                    )}
                </div>

                <div className="input-container d-flex flex-column mb-4">
                    <label className="mb-3">Description</label>
                    <textarea
                        name=""
                        id=""
                        cols="30"
                        onChange={handleCampDesc}
                        value={campaignDesc}
                        // value={prodDesc.map((desc) => desc.description).join('\n')}
                        style={{ color: '#666' }}
                    ></textarea>
                </div>
            
                <div className="input-container d-flex flex-column mb-4 prod-coupons w-100">
                    <label className="mb-3">Product coupons</label>
                    <ul className="coupons coupons-list flex-column">
                        {productDetails?.length > 0 ? (
                            productDetails?.map(product => (
                            <li className='d-flex flex-row align-items-center'>
                                <span>{product.product_name}</span>
                                <div className='d-flex align-items-center'>
                                {product.coupons?.map((coupon, i) => {
                                    const couponObject = {
                                        name: coupon,
                                        product_name: product.product_name,
                                        product_id: product.product_id,
                                        amount: product.amount[i].substring(1)
                                    };
                                    const isCouponSelected = selectedCoupons.some(selectedCoupon => selectedCoupon.name === couponObject.name && selectedCoupon.product_id === couponObject.product_id);
                                    const handleClick = () => {
                                    const selectedCouponIndex = selectedCoupons.findIndex(selectedCoupon => selectedCoupon.name === couponObject.name && selectedCoupon.product_id === couponObject.product_id);
                                    if (selectedCouponIndex !== -1) {
                                        setSelectedCoupons(prevSelectedCoupons => prevSelectedCoupons.filter((selectedCoupon, index) => index !== selectedCouponIndex));
                                        setSelectedCouponNames(prevSelectedCouponNames => prevSelectedCouponNames.filter((selectedCouponName, index) => index !== selectedCouponIndex));
                                        setSelectedCouponAmounts(prevSelectedCouponAmounts => prevSelectedCouponAmounts.filter((selectedCouponAmount, index) => index !== selectedCouponIndex));
                                    } else {
                                        setSelectedCoupons(prevSelectedCoupons => [...prevSelectedCoupons, couponObject]);
                                        setSelectedCouponNames(prevSelectedCouponNames => [...prevSelectedCouponNames, couponObject.name]);
                                        setSelectedCouponAmounts(prevSelectedCouponAmounts => {
                                        const existingProductIndex = prevSelectedCouponAmounts.findIndex(selectedCouponAmount => selectedCouponAmount.product_name === product.product_name && selectedCouponAmount.product_id === product.product_id);
                                        if (existingProductIndex !== -1) {
                                            const existingProduct = prevSelectedCouponAmounts[existingProductIndex];
                                            return prevSelectedCouponAmounts.map((selectedCouponAmount, index) => {
                                            if (index === existingProductIndex) {
                                                return {
                                                ...existingProduct,
                                                name: [...existingProduct.name, couponObject.name],
                                                amount: [...existingProduct.amount, couponObject.amount]
                                                };
                                            }
                                            return selectedCouponAmount;
                                            });
                                        }
                                        return [...prevSelectedCouponAmounts, {
                                            product_name: product.product_name,
                                            product_id: product.product_id,
                                            name: [couponObject.name],
                                            amount: [couponObject.amount]
                                        }];
                                        });
                                    }
                                    };
                                    return (
                                    <p
                                        key={coupon}
                                        className={`d-flex flex-column mb-0 ${isCouponSelected ? 'selected' : ''}`}
                                        onClick={handleClick}
                                    >
                                        {coupon} - {product.amount[i].substring(1)}
                                    </p>
                                    );
                                })}
                                </div>
                            </li>
                            ))
                        ) : (
                            <li className='align-items-start'>No Coupon Available</li>
                            )}
                    </ul>
                </div>

                <div className="buttons d-flex justify-content-center">
                    <button className='button button-blue' onClick={createNewCampaignDraft}>Save in draft</button>
                    <button className='button ms-4' onClick={createNewCampaign}>Send to MarketPlace</button>
                </div>
            </form>
        </div>
    </div>
  );
}

export default CreateCampaign;