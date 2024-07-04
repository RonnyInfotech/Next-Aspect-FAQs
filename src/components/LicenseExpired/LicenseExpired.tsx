import * as React from 'react';
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Button, Dialog, InputText, Divider } from 'primereact';
import { SPFI } from '@pnp/sp';
import { getSP } from '../../services/pnpConfig';
import { LISTS, PRODUCT_NAME, SECRET_KEY } from '../../common/constants';
import { format, isValid } from 'date-fns';
import { toast } from 'react-toastify';
import CustomToast from '../CustomToast/CustomToast';
import { tenantId } from '../../webparts/NextAspectFaqs/components/NextAspectFaqs';

const LicenseExpired = (props) => {
    const { licenseShow, isLicenseExpired, setExpired } = props;
    const [isLicenseShow, setIsLicenseShow] = useState(true);
    const [licenseKey, setLicenseKey] = useState(null);
    const [licenseData, setLicenseData] = useState(null);

    const notifySuccess = (message) => {
        toast.success(message);
    };

    const notifyError = (message) => {
        toast.error(message);
    };

    const closeDialog = () => {
        setIsLicenseShow(false);
        licenseShow(false);
        setExpired(true);
    };

    const handelSave = async () => {
        const sp: SPFI = getSP();
        const impListData = await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).items();

        const bytes = CryptoJS.AES.decrypt(licenseKey, SECRET_KEY);
        const licenseObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        var todayDate = new Date().getTime();
        var trialExpiryDate = new Date(licenseObject.expireDate).getTime();

        if (!isValid(new Date(licenseObject.expireDate))) {
            notifyError("License key is not valid!");
            return;
        }
        if (!licenseObject.expireDate && !licenseObject.productName && !licenseObject.licenseType) {
            notifyError("License key is not valid!");
            return;
        }
        if (licenseObject.clientURL != window.location.hostname) {
            notifyError("License key is not valid!");
            return;
        }

        if (licenseObject.productName != PRODUCT_NAME) {
            notifyError("License key is not valid!");
            return;
        }

        if (todayDate >= trialExpiryDate) {
            notifyError("License key is not valid!");
            return;
        }

        try {
            const sp: SPFI = getSP();
            const itemID = impListData.length > 0 ? impListData[0].ID : 1;
            await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).items.getById(itemID).update({
                licenseKey: licenseKey,
            });
            notifySuccess("License verified successfully");
            setTimeout(() => {
                setIsLicenseShow(false);
                licenseShow(false);
            }, 1000);
        } catch (err) {
            notifyError(err);
        }
    };

    const getLicenseInfo = async () => {
        const sp: SPFI = getSP();
        const impListData = await sp.web.lists.getByTitle(LISTS.LICENSE_TABLE.NAME).items();
        if (impListData[0].licenseKey) {
            const bytes = CryptoJS.AES.decrypt(impListData[0].licenseKey, SECRET_KEY);
            const decryptedObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            setLicenseData(decryptedObject);
        }
    };

    useEffect(() => {
        getLicenseInfo();
    }, []);

    const footerContent = (
        <div className='flex'>
            <div>
                <a href='https://www.sharepointempower.com/product-pricing-list' target='_blank' className="p-button explore-pricing">Explore Pricing</a>
            </div>
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <CustomToast />
            <Dialog
                header="License Verification"
                draggable={false}
                closeIcon={<i title="Close" className="pi pi-times"></i>}
                className='license-dialog'
                visible={isLicenseShow}
                onHide={closeDialog}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                // footer={footerContent}
                style={{ width: '33vw' }}
            >
                <div className="p-fluid grid flex align-items-end">
                    <div className="field col-12 md:col-9 lg:col-9 mb-0">
                        <label htmlFor="licenseKey" className="font-medium">License <span style={{ color: 'red' }}>*</span></label>
                        <InputText placeholder="xxxxx-xxxxx-xxxxx-xxxxx" className="p-inputtext-sm" id="licenseKey" name="License" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />
                    </div>
                    <div className="field col-12 md:col-3 lg:col-3 mb-0">
                        <Button size="small" label="Verify" onClick={handelSave} />
                    </div>
                    {licenseData &&
                        <>
                            <div className='col-12 md:col-4 font-semibold'>Tenant Id:</div>
                            <div className='col-12 md:col-8'>{tenantId}</div>
                            <Divider className='m-0' />
                            <div className='col-12 md:col-4 font-semibold'>Product Name:</div>
                            <div className='col-12 md:col-8'>{licenseData?.productName}</div>
                            <Divider className='m-0' />
                            <div className='col-12 md:col-4 font-semibold'>License:</div>
                            <div className='col-12 md:col-8'>{licenseData?.licenseType}</div>
                            <Divider className='m-0' />
                            {licenseData?.installationDate && licenseData?.licenseType.indexOf('Trial') == -1 && <>
                                <div className='col-12 md:col-4 font-semibold'>Sold At:</div>
                                <div className='col-12 md:col-8'>{format(new Date(licenseData?.installationDate), 'yyyy-MM-dd HH:mm:ss')}</div>
                                <Divider className='m-0' />
                                <div className='col-12 md:col-4 font-semibold'>Support Until:</div>
                                <div className='col-12 md:col-8'><span className='mr-2'>{format(new Date(licenseData?.expireDate), 'yyyy-MM-dd HH:mm:ss')}</span> <span className="p-tag" style={{ color: `${isLicenseExpired ? '#f72525' : '#39b526'}`, background: `${isLicenseExpired ? '#f7252520' : '#39b52620'}` }}>{isLicenseExpired ? 'License Expired' : 'Supported'}</span></div>
                                <Divider className='m-0' />
                            </>}
                        </>
                    }
                </div>
            </Dialog>
        </div>
    );
};

export default LicenseExpired;