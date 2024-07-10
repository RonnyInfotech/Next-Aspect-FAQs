import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { LISTS, PRODUCT_NAME, SECRET_KEY, TOTAL_LISTS, VERSION_KEY } from '../../../common/constants';
import { SPFI } from '@pnp/sp';
import { getSP } from '../../../services/pnpConfig';
import { createLists } from '../../../sharepointLists/lists';
import { HashRouter } from 'react-router-dom';
import App from '../../../components/App/App';
import { BlockUI, Dialog, Button } from 'primereact';
import AppLoader from '../../../components/AppLoader/AppLoader';
import LicenseExpired from '../../../components/LicenseExpired/LicenseExpired';
import FAQsContextProvider from '../../../context/FAQsContext';
import { INextAspectFaqsProps } from './INextAspectFaqsProps';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../services/firebase';

export let tenantId: string;
export let absoluteUrl: string;
export let currentUserId: any;
export let currentUserEmail: string;
export let currentUserName: string;
export let profileImageUrl: string;
export let Expired: boolean;

const NextAspectFaqs = (props: INextAspectFaqsProps) => {
  const Faqs = () => {
    const [render, setRender] = useState(true);
    const [isExpired, setExpired] = useState(false);
    const [isLicenseExpired, setLicenseExpired] = useState(false);
    const [productType, setProductType] = useState("");
    const [licenseDetails, setLicenseDetails] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    tenantId = props.tenantId;
    absoluteUrl = props.absoluteUrl;
    currentUserId = props.currentUserId;
    currentUserEmail = props.userEmail?.toLowerCase();
    currentUserName = props.userDisplayName;
    profileImageUrl = absoluteUrl + '/_layouts/15/userphoto.aspx?size=S&username=';

    useEffect(() => {
      checkListExist().then((_r) => {
        if (_r) {
          setRender(true);
        } else {
          setRender(false);
          createLists().then(() => {
            setRender(true);
          }).catch((err) => { console.log("err..", err) });
        }
      });
    }, []);

    const getAllList = async () => {
      const sp: SPFI = getSP();
      const listData = await (await sp.web.lists()).filter((x: any) => x.Description.indexOf(VERSION_KEY) != -1).map((x) => x.Title);

      if (listData.length > 0) {
        const groups = await sp.web.siteGroups();
        const checkGroupExists = groups.filter(({ LoginName }) => LoginName === LISTS.ADMIN_GROUP.NAME);
        if (checkGroupExists.length > 0) {
          const groupName = await sp.web.siteGroups.getByName(LISTS.ADMIN_GROUP.NAME)();
          if (groupName.Id) {
            listData.push(LISTS.ADMIN_GROUP.NAME);
          }
        }
      }
      return listData;
    };

    const checkListExist = async () => {
      let _isChecked;
      let listData: any = await getAllList();
      if (listData.length == 0)
        return _isChecked = false;

      for (var _i = 0; _i < TOTAL_LISTS.length; _i++) {
        if (TOTAL_LISTS[_i] == LISTS.LICENSE_TABLE.NAME) {

          try {
            const sp: SPFI = getSP();
            const impListData = await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).items();
            const bytes = CryptoJS.AES.decrypt(impListData[0].licenseKey, SECRET_KEY);
            const decryptedObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            const data: any = decryptedObject;
            if (data.clientURL === window.location.hostname) {
              try {
                const q = query(collection(db, 'tenetDetails'), where('hostname', '==', window.location.hostname));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                  setIsBlocked(true);
                  _isChecked = true;
                  return _isChecked;
                }
              } catch (error) {
                console.log(error);
              }
              if (!data.expireDate && !data.productName && !data.licenseType) {
                setExpired(true);
                setLicenseExpired(true);
              }
              else {
                setProductType(data.licenseType);

                var todayDate = new Date().getTime();
                var trialExpiryDate = new Date(data.expireDate).getTime();
                if (todayDate >= trialExpiryDate && data.productName === PRODUCT_NAME) {
                  setExpired(true);
                  setLicenseExpired(true);
                } else {
                  setExpired(false);
                }
              }
            } else {
              setExpired(true);
              setLicenseExpired(true);
            }
          }
          catch (ex) {
            setExpired(true);
            setLicenseExpired(true);
            _isChecked = true;
            break;
          }
        }

        if (listData.includes(TOTAL_LISTS[_i])) {
          _isChecked = true;
        } else {
          _isChecked = false;
          break;
        }
      }
      return _isChecked;
    };

    const isLicenseShow = (isLicense) => {
      setLicenseDetails(isLicense);
      checkListExist();
    };

    const handleUpgradeNow = () => {
      setLicenseDetails(true);
      setExpired(false);
    };

    return (
      <div>
        {
          render ? <HashRouter><App /></HashRouter> :
            <BlockUI blocked={!render} fullScreen template={AppLoader} />
        }

        <div className="card flex justify-content-center">
          <Dialog
            visible={isExpired}
            style={{ width: '50vw' }}
            draggable={false}
            onHide={() => setExpired(false)}
            showHeader={false}
            closeOnEscape={false}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          >
            <div className='flex justify-content-center align-items-center'>
              <div className="text-center">
                <img className='mt-4' src={require('../assets/images/Expired.png')} alt="" style={{ width: '40%' }} />
                <h2 className='mt-0'>Free trial is expired</h2>
                <h5 className='font-medium'>Your license for this product has expired. To continue enjoying uninterrupted access and benefits, please renew your license as soon as possible. If you have any questions or concerns, reach out to our support team.</h5>
                <span className='gap-2 flex justify-content-center align-items-center'>
                  <Button size="small" label="Upgrade Now" severity="success" raised icon="pi pi-refresh" onClick={handleUpgradeNow} />
                  <span>OR</span>
                  <Button size="small" label="Contact us" severity="success" text icon="pi pi-arrow-right" iconPos='right' />
                </span>
              </div>
            </div>
          </Dialog>
        </div>

        {/* Is blocked Dialog*/}
        <Dialog
          visible={isBlocked}
          showHeader={false}
          draggable={false}
          closeOnEscape={false}
          style={{ width: '38vw' }}
          breakpoints={{ '960px': '75vw', '641px': '90vw' }}
          contentStyle={{ padding: '1.5rem', borderRadius: '6px' }}
        >
          <div className="text-center">
            <img src={require('../assets/images/access-denied.png')} alt="Error" width={100} />
            <h1 className='text-2xl mb-1' style={{ color: '#000000' }}>Oops, Please try again.</h1>
            <p> We're not exactly sure what happened, but something went wrong. <br />
              If you need immediate help, please <a className='contact-us' href="mailto:bhautik@sharepointempower.com">let us know</a>.
            </p>
            <a className='contact-us' href='#'>Explore pricing</a>
          </div>
        </Dialog>

        {licenseDetails && <LicenseExpired licenseShow={isLicenseShow} isLicenseExpired={isLicenseExpired} setExpired={setExpired} />}
      </div>
    );
  };

  return (
    <FAQsContextProvider>
      <Faqs />
    </FAQsContextProvider>
  );
};

export default NextAspectFaqs;