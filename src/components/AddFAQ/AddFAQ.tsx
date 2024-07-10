import React, { useContext, useEffect, useRef, useState } from 'react';
import { classNames, DataTable, Column, Button, Card, InputSwitch, Dialog, InputText, FilterMatchMode, FilterOperator, BlockUI, Dropdown, Editor } from 'primereact';
import { FAQs } from '../../model/FAQ';
import { toast } from 'react-toastify';
import { addItemToList, deleteListItem, getSPListItemById, updateListItem } from '../../services/SPService';
import { GET_LIST_QUERY_PARAMS, LISTS } from '../../common/constants';
import { FAQsContext } from '../../context/FAQsContext';
import CustomToast from '../CustomToast/CustomToast';
import Loader from '../Loader/Loader';
import { format } from 'date-fns';
import DOMPurify from "dompurify";
import { absoluteUrl } from '../../webparts/nextAspectFaqs/components/NextAspectFaqs';
import './AddFAQ.css';

const AddFAQ = () => {
    const initialState = new FAQs();
    const { categories, FAQsItems, setFAQsItems, getCategoriesData } = useContext(FAQsContext);
    const [state, setState] = useState(initialState);
    const { ID, Title, Active, CategoryId } = state;
    const [categoryFormVisible, setCategoryFormVisible] = useState(false);
    const [deleteFAQsDialog, setDeleteFAQsDialog] = useState(false);
    const [deleteFAQDialog, setDeleteFAQDialog] = useState(false);
    const [FAQDialog, setFAQDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [selectedFAQs, setSelectedFAQs] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState(null);
    const [Answer, setAnswer] = useState(null);
    const dt = useRef(null);

    console.log("categories....", categories);
    console.log("FAQsItems....", FAQsItems);

    // initialize global filter
    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            Title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            'Category.Title': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilter('');
    };

    useEffect(() => {
        document.title = 'Manage FAQs';
        initFilters();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilter(value);
    };

    // success tost message
    const notifySuccess = (message) => {
        toast.success(message);
    };

    // error tost message
    const notifyError = (message) => {
        toast.error(message);
    };

    // handle input change
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value
        });
    };

    // open FAQ Form Dialog
    const openNew = () => {
        setAnswer(null);
        setState(initialState);
        setSubmitted(false);
        setFAQDialog(true);
    };

    // Hide FAQ Dialog
    const hideDialog = () => {
        setSubmitted(false);
        setFAQDialog(false);
    };

    //Hide Delete Dialog (Popup) for single delete items
    const hideDeleteDialog = () => {
        setDeleteFAQDialog(false);
    };

    //Hide Delete Dialog (Popup) for multiple delete items
    const hideDeletesDialog = () => {
        setDeleteFAQsDialog(false);
    };

    const response = DOMPurify.sanitize(Answer, {
        ALLOWED_TAGS: ["#text"]
    });

    // Add or Update FAQ to sharepoint list
    const saveFAQs = async () => {
        setBlocked(true);
        if (!Title?.trim().length || !response?.trim().length || !CategoryId) {
            setSubmitted(true);
            setBlocked(false);
        } else {
            delete state['Category'];
            if (!ID) {
                await addItemToList(LISTS.FAQS_TABLE.NAME, { ...state, Content: Answer }).then(async (res) => {
                    notifySuccess('Added FAQ successfully');
                    const queryParams = new GET_LIST_QUERY_PARAMS();
                    queryParams.selectProperties = ["*,Category/ID,Category/Title"];
                    queryParams.expandProperties = ["Category"];
                    const _item = await getSPListItemById(LISTS.FAQS_TABLE.NAME, queryParams.selectProperties, queryParams.expandProperties, res.data.ID);
                    FAQsItems.push(_item);
                    setFAQDialog(false);
                    setBlocked(false);
                }).catch((err) => {
                    notifyError(err);
                    setBlocked(false);
                });
            } else {
                delete state['odata.metadata'];
                delete state['odata.editLink'];
                delete state['Category@odata.navigationLinkUrl'];
                await updateListItem(LISTS.FAQS_TABLE.NAME, { ...state, Content: Answer }, ID).then(async (res) => {
                    const queryParams = new GET_LIST_QUERY_PARAMS();
                    queryParams.selectProperties = ["*,Category/ID,Category/Title"];
                    queryParams.expandProperties = ["Category"];
                    notifySuccess('Updated FAQ successfully');
                    const _item = await getSPListItemById(LISTS.FAQS_TABLE.NAME, queryParams.selectProperties, queryParams.expandProperties, ID);
                    const updatedData = FAQsItems?.map((ele) => {
                        if (ele?.ID == ID) {
                            return _item;
                        } else {
                            return ele;
                        }
                    });
                    setFAQsItems(updatedData);
                    setFAQDialog(false);
                    setBlocked(false);
                }).catch((err) => {
                    notifyError(err);
                    setBlocked(false);
                });
            }
            setSubmitted(false);
            setBlocked(false);
        }
    };

    // Edit FAQs
    const editFAQ = (state) => {
        setState(state);
        setFAQDialog(true);
        setAnswer(state.Content);
    };

    // confirm Delete Dialog
    const confirmDeleteFAQ = (state) => {
        setState(state);
        setDeleteFAQDialog(true);
    };

    // Delete Single FAQ
    const deleteFAQ = async () => {
        setBlocked(true);
        try {
            setDeleteFAQDialog(false);
            await deleteListItem(LISTS.FAQS_TABLE.NAME, ID);
            setFAQsItems(FAQsItems.filter((val) => val.ID !== ID));
            notifySuccess('Deleted Successfully');
            setBlocked(false);
        } catch (err) {
            notifyError('Failed to Delete');
            setBlocked(false);
        } finally {
            setBlocked(false);
            setDeleteFAQDialog(false);
        }
    };

    // export csv data
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    // confirm selected items for delete
    const confirmDeleteSelected = () => {
        setDeleteFAQsDialog(true);
    };

    //delete multiple FAQs
    const deleteSelectedFAQs = async () => {
        setBlocked(true);
        try {
            setDeleteFAQsDialog(false);
            for (const item of selectedFAQs) {
                await deleteListItem(LISTS.FAQS_TABLE.NAME, item.ID);
                const _faqs = FAQsItems?.findIndex(ele => ele.ID == item.ID);
                FAQsItems?.splice(_faqs, 1);
            }
            setFAQsItems(FAQsItems);
            notifySuccess('Deleted Successfully');
            setSelectedFAQs([]);
            setBlocked(false);
        } catch (err) {
            notifyError('Failed to Delete');
            setBlocked(false);
        } finally {
            setBlocked(false);
            setDeleteFAQsDialog(false);
        }
    };

    // clear filter
    const clearFilter = async () => {
        await initFilters();
    };

    // Update Active InActive Direct from Grid
    const handleActiveChange = async (e, rowData) => {
        const { value } = e.target;
        await updateListItem(LISTS.FAQS_TABLE.NAME, { Active: value }, rowData.ID).then(async (res) => {
            notifySuccess('Updated FAQ successfully');
            const queryParams = new GET_LIST_QUERY_PARAMS();
            queryParams.selectProperties = ["*,Category/ID,Category/Title"];
            queryParams.expandProperties = ["Category"];
            const _item = await getSPListItemById(LISTS.FAQS_TABLE.NAME, queryParams.selectProperties, queryParams.expandProperties, rowData?.ID);
            const updatedData = FAQsItems?.map((ele) => {
                if (ele?.ID == rowData?.ID) {
                    return _item;
                } else {
                    return ele;
                }
            });
            setFAQsItems(updatedData);
        }).catch((err) => {
            notifyError(err);
        });
    };

    //add dropdown footer value
    const panelFooterTemplate = () => {
        return (
            <div className='header-button flex ml-auto'>
                <Button tooltipOptions={{ position: 'top' }} tooltip='Add New Category' text className="mr-2 button-color ml-auto" icon="pi pi-plus" onClick={() => setCategoryFormVisible(true)} />
            </div>
        );
    };

    // Toolbar
    const header = (
        <div className='flex align-items-center gap-2'>
            {selectedFAQs?.length > 0 && <div className="flex flex-wrap align-items-center justify-content-between">
                <Button size="small" tooltipOptions={{ position: 'top' }} tooltip='Delete' label='Delete' icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedFAQs || !selectedFAQs?.length} />
            </div>}
            <Button size="small" tooltipOptions={{ position: 'top' }} tooltip="Add New" label="Add New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <div className="flex flex-wrap gap-2 ml-auto align-items-center">
                <span className={`p-input-icon-left`}>
                    <i className="pi pi-search" />
                    <InputText className='p-inputtext-sm w-full' type="search" value={globalFilter} onInput={onGlobalFilterChange} placeholder="Search..." />
                </span>
                {/* <Button size="small" tooltipOptions={{ position: 'top' }} tooltip="Export" label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
                <Button tooltipOptions={{ position: 'top' }} tooltip="Clear Filter" icon="pi pi-filter-slash" text onClick={clearFilter} />
            </div>
        </div >
    );

    const TitleTemplate = (rowData) => {
        return <div onClick={() => editFAQ(rowData)} className='faq-title'>{rowData.Title}</div>
    };

    const activeTemplate = (rowData) => {
        return <InputSwitch checked={rowData.Active} onChange={(e) => handleActiveChange(e, rowData)} />
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button tooltip="Edit" tooltipOptions={{ position: 'top' }} size="small" icon="pi pi-pen-to-square" rounded text className="mr-2" onClick={() => editFAQ(rowData)} />
                <Button tooltip="Delete" tooltipOptions={{ position: 'top' }} size="small" icon="pi pi-trash" rounded text severity="danger" onClick={() => confirmDeleteFAQ(rowData)} />
            </React.Fragment>
        );
    };

    const filterClearTemplate = (options) => {
        return <Button className='text-color-secondary' type="button" label="Clear" icon="pi pi-times" onClick={options.filterClearCallback} text></Button>;
    };

    const filterApplyTemplate = (options) => {
        return <Button className='text-color-secondary' type="button" label="Apply" icon="pi pi-check" onClick={options.filterApplyCallback} text></Button>;
    };

    const FAQDialogFooter = (
        <React.Fragment>
            <Button size="small" label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button size="small" label="Save" icon="pi pi-check" severity="success" onClick={saveFAQs} />
        </React.Fragment>
    );

    const deleteFAQDialogFooter = (
        <React.Fragment>
            <Button size="small" label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
            <Button size="small" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteFAQ} />
        </React.Fragment>
    );

    const deleteFAQsDialogFooter = (
        <React.Fragment>
            <Button size="small" label="No" icon="pi pi-times" outlined onClick={hideDeletesDialog} />
            <Button size="small" label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedFAQs} />
        </React.Fragment>
    );

    return (
        <div>
            <CustomToast />
            <BlockUI blocked={blocked} fullScreen template={<Loader />} />
            <DataTable
                className="manage-categories"
                ref={dt}
                scrollable
                size="small"
                dataKey="Id"
                paginator
                rows={10}
                removableSort
                header={header}
                selectionPageOnly
                onRowClick={(e) => e.preventDefault()}
                filters={filters}
                value={FAQsItems}
                globalFilter={globalFilter}
                selection={selectedFAQs}
                rowsPerPageOptions={[5, 10, 25]}
                globalFilterFields={['Title', 'Category.Title']}
                onSelectionChange={(e) => setSelectedFAQs(e.value)}
                exportFilename={'FAQs_' + format(new Date(), 'MM/dd/yyyy')}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} FAQs'
            >
                <Column selectionMode="multiple" exportable={false} style={{ width: '5rem' }}></Column>
                <Column field="Title" header="Question" body={TitleTemplate} sortable filter filterClear={filterClearTemplate} filterApply={filterApplyTemplate} filterPlaceholder='Search...' />
                <Column field="Category.Title" header="Category" sortable filter filterClear={filterClearTemplate} filterApply={filterApplyTemplate} filterPlaceholder='Search...' />
                <Column field="Active" header="Status" body={activeTemplate} sortable filter />
                <Column body={actionBodyTemplate} header="Action" exportable={false} style={{ width: '8rem' }}></Column>
            </DataTable>

            <Dialog draggable={false} visible={FAQDialog} style={{ width: '45rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={!ID ? 'Add New FAQ' : 'Edit FAQ'} modal className="p-fluid" footer={FAQDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label className='font-bold' htmlFor="name">Category name <span style={{ color: 'red' }}>*</span></label>
                    <Dropdown
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !CategoryId })}
                        value={CategoryId}
                        options={categories}
                        name="CategoryId"
                        optionValue="Id"
                        optionLabel="Title"
                        filter
                        placeholder="Select Category"
                        onChange={onInputChange}
                        panelClassName='search-drop-drown'
                        panelFooterTemplate={panelFooterTemplate}
                    />
                    {submitted && !CategoryId && <small className="p-error">The Category is required field.</small>}
                </div>

                <div className="field">
                    <label className='font-bold' htmlFor="Question">Question <span style={{ color: 'red' }}>*</span></label>
                    <InputText placeholder="Why An FAQ Resource?" id="Question" name="Title" value={Title} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !Title?.trim().length })} />
                    {submitted && !Title?.trim().length && <small className="p-error">The question is required field.</small>}
                </div>


                <div className="field">
                    <label className='font-bold' htmlFor="name">Answer <span style={{ color: 'red' }}>*</span></label>
                    <Editor value={Answer} onTextChange={(e) => setAnswer(e.htmlValue)} style={{ height: '200px' }} />
                    {submitted && !Answer?.trim().length && <small className="p-error">The answer is required field.</small>}
                </div>

                <div className="field flex">
                    <label className='font-bold mr-3' htmlFor="Active">Active</label>
                    <InputSwitch size="small" name="Active" checked={Active} onChange={onInputChange} />
                </div>
            </Dialog>

            <Dialog visible={deleteFAQDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} closable={false} draggable={false} modal footer={deleteFAQDialogFooter} onHide={hideDeleteDialog}>
                <div className='flex'>
                    <div className='delete-icon'>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#e53e3e', marginTop: '-0.2rem' }} />
                    </div>
                    <div className='ml-3' style={{ width: '85%' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#313e6a' }}>{state && (<span>Are you sure you want to delete {Title}?</span>)}</div>
                        <div className='mt-2' style={{ fontSize: '0.875rem', fontWeight: '400', color: '#7f88a5' }}>All data will be permanently removed. All related data will be deleted. This action cannot be undone.</div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteFAQsDialog} style={{ width: '30rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} closable={false} draggable={false} modal footer={deleteFAQsDialogFooter} onHide={hideDeletesDialog}>
                <div className='flex'>
                    <div className='delete-icon'>
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '1.5rem', color: '#e53e3e', marginTop: '-0.2rem' }} />
                    </div>
                    <div className='ml-3' style={{ width: '85%' }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#313e6a' }}>Are you sure you want to delete the selected FAQs?</div>
                        <div className='mt-2' style={{ fontSize: '0.875rem', fontWeight: '400', color: '#7f88a5' }}>All data will be permanently removed. All related data will be deleted. This action cannot be undone.</div>
                    </div>
                </div>
            </Dialog>

            <Dialog
                closeIcon={<i title="Close" className="pi pi-times"></i>}
                maximizeIcon={<i title="Maximize" className="pi pi-window-maximize"></i>}
                minimizeIcon={<i title="Minimize" className="pi pi-window-minimize"></i>}
                header="Add New Category" visible={categoryFormVisible} style={{ width: '75vw' }} maximizable modal onHide={async () => { setCategoryFormVisible(false); await getCategoriesData(); }}>
                <Card className='card-design'>
                    <iframe style={{ width: "100%", height: "50rem" }} src={`${absoluteUrl}/Lists/${LISTS.CATEGORIES_TABLE.NAME}/AllItems.aspx`} title="Category"></iframe>
                </Card>
            </Dialog>
        </div>
    );
};

export default AddFAQ;