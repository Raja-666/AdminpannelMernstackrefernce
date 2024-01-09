import { CButton, CFormSelect, CFormTextarea, CModal, CModalBody, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetKycListMutation } from 'src/app/services/kyclist'
import { useGetKycUpdateMutation } from 'src/app/services/kyclist'

const Kyc = () => {
  const [open, setOpen] = useState(false)
  const [srcData, setSrcData] = useState({})
  const [reason, setReason] = useState({
    frontReason: '',
    backReason: '',
    selfiReason: ''
  })
  const [kyclist,] = useGetKycListMutation()
  const [updatekyc,] = useGetKycUpdateMutation()

  const [list, setList] = useState([])
  const handleList = async () => {
    const res = await kyclist({
      // status: 0
    }).unwrap()
    setList(res.data)
    console.log(res.data)
  }

  const handleSetterSrc = (propData) => {
    setSrcData(propData)
  }

  const handleApproveBtn = async (type, flag) => {
    // flag : 1 ->> approve , 0 --> reject
    console.log(type, flag, 'typeee')
    let obj = {
      _id: srcData._id,
      type,
      flag,
      reason: reason[type]
    }

    if (flag === 1) {
      delete obj.reason
    }

    if (flag === 0) {
      if (reason[type] === '') {
        alert('Please select reason')
        return
      }
    }
    obj['address'] = srcData['address']
    const res = await updatekyc(obj).unwrap()
    console.log('resss', res)
    handleList()
    setOpen(!open)
  }

  const handleSelect = e => {
    const { value, name } = e.target
    setReason({ ...reason, [name]: value })
  }
  useEffect(() => {
    handleList()
  }, [open])


  return (
    <>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">proofType</CTableHeaderCell>
            <CTableHeaderCell scope="col">number</CTableHeaderCell>
            <CTableHeaderCell scope="col">frontSideProof</CTableHeaderCell>
            <CTableHeaderCell scope="col">backSideProof</CTableHeaderCell>
            <CTableHeaderCell scope="col">selfieProof</CTableHeaderCell>
            <CTableHeaderCell scope="col">address</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            list?.map((item, id) => {
              const { proofType, number, frontSideProof, backSideProof, selfieProof, address, status, _id , completedStatus } = item

              const sts = completedStatus ? 'Verified' : 'Pending'

              let rejectMessage = '';
              if (status === 2) {
                rejectMessage = "Kyc has been rejected";
              }
              return (
                <CTableRow key={id}>
                  <CTableHeaderCell scope="row">{proofType}</CTableHeaderCell>
                  <CTableHeaderCell scope="row">{number}</CTableHeaderCell>
                  <CTableDataCell>
                    <img src={frontSideProof} alt='loading' width='75' height='75' />
                  </CTableDataCell>
                  <CTableDataCell>
                    <img src={backSideProof} alt='loading' width='75' height='75' />
                  </CTableDataCell>
                  <CTableDataCell>
                    <img src={selfieProof} alt='loading' width='75' height='75' />
                  </CTableDataCell>
                  <CTableDataCell>{address}</CTableDataCell>
                  <CTableDataCell>{sts}</CTableDataCell>
                  

                  <CTableDataCell> {status !== 2 && <button onClick={() => {
                    handleSetterSrc(item)
                    setOpen(!open);
                    // handleUpdate(_id, 2)
                  }}>Action</button>} </CTableDataCell>
                  {status === 2 && <CTableDataCell>{rejectMessage}</CTableDataCell>}
                </CTableRow>
              )
            })
          }

        </CTableBody>
      </CTable>

      <CModal
        size="xl"
        backdrop="static"
        visible={open}
        onClose={() => setOpen(false)}
        aria-labelledby="OptionalSizesExample1"
      >
        <CModalHeader>
          <CModalTitle id="OptionalSizesExample1">KYC Reject</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <>
            <div
              style={{
                display: 'flex',
                flexDirection:'column',
                gap: 2,
                justifyContent: 'space-between'
              }}
            >
              <div
                style={{
                  padding: '20px',
                  margin: '10px',
                  border: '1px solid grey',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  justifyContent: "space-around"
                }}
              >
                <img src={srcData?.frontSideProof} alt='loading' />
                <CFormSelect size="lg" className="mb-3" aria-label="Large select example"
                  onChange={(e) => handleSelect(e)}
                  id='frontReason'
                  name='frontReason'
                >
                  <option>Select Reason</option>
                  <option value="Image not clear">Image not clear</option>
                  <option value="ID Proof mismatch">ID Proof mismatch</option>
                  <option value="Invalid proof">Invalid proof</option>
                </CFormSelect>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}>


                  <>
                    <CButton color="success" onClick={() => handleApproveBtn('frontStatus', 1)}>
                      Approve
                    </CButton>

                    <CButton color="danger" onClick={() => handleApproveBtn('frontReason', 0)}>
                      Reject
                    </CButton>
                  </>

                  {/* {
                    srcData?.frontStatus ?
                      <CButton color='success' disabled>Approved</CButton>
                      :
                      <>
                        <CButton color="success" onClick={() => handleApproveBtn('frontStatus', 1)}>
                          Approve
                        </CButton>

                        <CButton color="danger" onClick={() => handleApproveBtn('frontReason', 0)}>
                          Reject
                        </CButton>
                      </>
                  } */}


                </div>
                <div>
                  {
                    srcData?.frontStatus === false && srcData?.frontReason ?
                      <p>{srcData?.frontReason}</p>
                      : srcData?.frontStatus === true ?
                        < p > {'Approved'}</p>
                        :
                        null
                  }
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  margin: '10px',
                  border: '1px solid grey',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  justifyContent: "space-around"
                }}
              >
                <img src={srcData?.backSideProof} alt='loading' />
                <CFormSelect size="lg" className="mb-3" aria-label="Large select example"
                  onChange={(e) => handleSelect(e)}
                  id='backReason'
                  name='backReason'
                >
                  <option>Select Reason</option>
                  <option value="Image not clear">Image not clear</option>
                  <option value="ID Proof mismatch">ID Proof mismatch</option>
                  <option value="Invalid proof">Invalid proof</option>
                </CFormSelect>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}>
                  
                        <CButton color="success" onClick={() => handleApproveBtn('backStatus', 1)}>
                          Approve
                        </CButton>

                        <CButton color="danger" onClick={() => handleApproveBtn('backReason', 0)}>
                          Reject
                        </CButton>

                </div>
                <div>
                  {
                    srcData?.backStatus === false && srcData?.backReason ?
                      <p>{srcData?.backReason}</p>
                      : srcData?.backStatus === true ?
                        < p > {'Approved'}</p>
                        :
                        null
                  }
                </div>
              </div>

              <div
                style={{
                  padding: '20px',
                  margin: '10px',
                  border: '1px solid grey',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  justifyContent: "space-around"
                }}
              >
                <img src={srcData?.selfieProof} alt='loading' />
                <CFormSelect size="lg" className="mb-3" aria-label="Large select example"
                  onChange={(e) => handleSelect(e)}
                  id='selfiReason'
                  name='selfiReason'
                >
                  <option>Select Reason</option>
                  <option value="Image not clear">Image not clear</option>
                  <option value="ID Proof mismatch">ID Proof mismatch</option>
                  <option value="Invalid proof">Invalid proof</option>
                </CFormSelect>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-evenly'
                }}>


                        <CButton color="success" onClick={() => handleApproveBtn('selfiStatus', 1)}>
                          Approve
                        </CButton>

                        <CButton color="danger" onClick={() => handleApproveBtn('selfiReason', 0)}>
                          Reject
                        </CButton>
                </div>
                <div>
                  {
                    srcData?.selfiStatus === false && srcData?.selfiReason ?
                      <p>{srcData?.selfiReason}</p>
                      : srcData?.selfiStatus === true ?
                        < p > {'Approved'}</p>
                        :
                        null
                  }
                </div>
              </div>
            </div>

          </>
        </CModalBody>
      </CModal >
    </>

  )
}

export default Kyc
