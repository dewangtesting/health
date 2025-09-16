import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      
      <div className="main px-lg-4 px-md-4">
        <Header />
        
        <div className="body d-flex py-lg-3 py-md-2">
          <div className="container-xxl">
            <div className="row clearfix">
              <div className="col-md-12">
                <div className="card border-0 mb-4 no-bg">
                  <div className="card-header py-3 px-0 d-flex align-items-center justify-content-between border-bottom">
                    <h3 className="fw-bold mb-0">Hospital Dashboard</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-3 row-deck">
              <div className="col-md-6 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <i className="icofont-patient-bed fa-3x text-primary"></i>
                    <h6 className="mt-3 mb-0 fw-bold small-14">Total Patients</h6>
                    <span className="text-big">2,186</span>
                    <span className="d-block text-success small">+12% than last month</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <i className="icofont-doctor fa-3x text-success"></i>
                    <h6 className="mt-3 mb-0 fw-bold small-14">Total Doctors</h6>
                    <span className="text-big">127</span>
                    <span className="d-block text-info small">+3 new this month</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <i className="icofont-calendar fa-3x text-warning"></i>
                    <h6 className="mt-3 mb-0 fw-bold small-14">Today's Appointments</h6>
                    <span className="text-big">89</span>
                    <span className="d-block text-warning small">15 pending confirmations</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <i className="icofont-pills fa-3x text-danger"></i>
                    <h6 className="mt-3 mb-0 fw-bold small-14">Medicine Stock</h6>
                    <span className="text-big">1,247</span>
                    <span className="d-block text-danger small">23 items low stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="row g-3">
              <div className="col-lg-8 col-md-12">
                <div className="card mb-3">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Recent Patient Activities</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0" style={{width: '100%'}}>
                            <thead>
                              <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img className="avatar rounded-circle" src="/assets/images/xs/avatar1.jpg" alt="" />
                                    <div className="ms-2">
                                      <h6 className="mb-0">John Smith</h6>
                                      <span className="text-muted">ID: #P001</span>
                                    </div>
                                  </div>
                                </td>
                                <td>Dr. Sarah Wilson</td>
                                <td>2024-01-15</td>
                                <td><span className="badge bg-success">Completed</span></td>
                                <td>
                                  <button className="btn btn-outline-secondary btn-sm">View</button>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img className="avatar rounded-circle" src="/assets/images/xs/avatar2.jpg" alt="" />
                                    <div className="ms-2">
                                      <h6 className="mb-0">Emma Johnson</h6>
                                      <span className="text-muted">ID: #P002</span>
                                    </div>
                                  </div>
                                </td>
                                <td>Dr. Michael Brown</td>
                                <td>2024-01-15</td>
                                <td><span className="badge bg-warning">In Progress</span></td>
                                <td>
                                  <button className="btn btn-outline-secondary btn-sm">View</button>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img className="avatar rounded-circle" src="/assets/images/xs/avatar3.jpg" alt="" />
                                    <div className="ms-2">
                                      <h6 className="mb-0">Robert Davis</h6>
                                      <span className="text-muted">ID: #P003</span>
                                    </div>
                                  </div>
                                </td>
                                <td>Dr. Lisa Anderson</td>
                                <td>2024-01-16</td>
                                <td><span className="badge bg-primary">Scheduled</span></td>
                                <td>
                                  <button className="btn btn-outline-secondary btn-sm">View</button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h6 className="mb-0 fw-bold">Quick Actions</h6>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button className="btn btn-primary">
                        <i className="icofont-plus me-2"></i>Add New Patient
                      </button>
                      <button className="btn btn-success">
                        <i className="icofont-calendar me-2"></i>Book Appointment
                      </button>
                      <button className="btn btn-info">
                        <i className="icofont-doctor me-2"></i>Add Doctor
                      </button>
                      <button className="btn btn-warning">
                        <i className="icofont-pills me-2"></i>Manage Medicine
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
