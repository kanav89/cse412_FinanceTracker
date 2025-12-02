import { useState, useEffect } from 'react'

function Budget({ userId }) {
  // defining the states
  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [addf, setaddf] = useState(false)
  const [eId, seteId] = useState(null)
  const [fDat, setfDat] = useState({


    category_id: '',
    amount_limit: '',
    budget_month: new Date().getMonth() + 1,
    budget_year: new Date().getFullYear()
  })

  // fetching data from the backend
  useEffect(() => {
    fetchData()
  }, [userId])

  // fetching data from the backend
  const fetchData = async () => {
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        fetch(`http://localhost:5000/budgets/${userId}`),
        fetch('http://localhost:5000/categories')
      ])
      const budgetsData = await budgetsRes.json()
      const categoriesData = await categoriesRes.json()
      setBudgets(budgetsData)
      setCategories(categoriesData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // handling the add budget
  const handleAddBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // sending the data to the backend
          user_id: userId,
          category_id: fDat.category_id,
          amount_limit: parseFloat(fDat.amount_limit),
          budget_month: parseInt(fDat.budget_month),
          budget_year: parseInt(fDat.budget_year)
        })
      })
      if (response.ok) {
        setfDat({
          category_id: '',
          amount_limit: '',
          budget_month: new Date().getMonth() + 1,
          budget_year: new Date().getFullYear()
        })
        setaddf(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error adding budget:', error)
    }
  }

  // handling editing of budget
  const startEdit = (budget) => {
    seteId(budget[0])
    setfDat({
      category_id: budget[2].toString(),
      amount_limit: budget[3].toString(),
      budget_month: budget[4],
      budget_year: budget[5]
    })
  }

  // handling updating of budget
  const handleUpdateBudget = async (budgetId) => {
    try {
      const response = await fetch(`http://localhost:5000/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: fDat.category_id,
          amount_limit: parseFloat(fDat.amount_limit),
          budget_month: parseInt(fDat.budget_month),
          budget_year: parseInt(fDat.budget_year)
        })
      })
      if (response.ok) {
        seteId(null)
        setfDat({
          category_id: '',
          amount_limit: '',
          budget_month: new Date().getMonth() + 1,
          budget_year: new Date().getFullYear()
        })
        fetchData()
      }
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }

  // handling deleting of budget
  const deleteBudget = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await fetch(`http://localhost:5000/budgets/${budgetId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          fetchData()
        }
      } catch (error) {
        console.error('Error deleting budget:', error)
      }
    }
  }

  // handling canceling of edit
  const cancelEdit = () => {
    seteId(null)
    setfDat({
      category_id: '',
      amount_limit: '',
      budget_month: new Date().getMonth() + 1,
      budget_year: new Date().getFullYear()
    })
  }

  // loading state
  if (loading) {
    return <div>Loading budgets...</div>
  }
  // ui
  return (
    <div>
      <div className="section-header">
        <h2>My Budgets</h2>
        <button
          onClick={() => setaddf(!addf)}
          className="btn-primary"
        >
          {addf ? 'Cancel' : '+ Add Budget'}
        </button>
      </div>

      {addf && (
        <form onSubmit={handleAddBudget} className="form-card">
          <div className="form-group">
            <label>Category</label>
            <select
              value={fDat.category_id}
              onChange={(e) => setfDat({ ...fDat, category_id: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category[0]} value={category[0]}>
                  {category[1]} ({category[2]})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Amount Limit</label>
            <input
              type="number"
              placeholder="Amount Limit"
              value={fDat.amount_limit}
              onChange={(e) => setfDat({ ...fDat, amount_limit: e.target.value })}
              step="0.01"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <input
                type="number"
                min="1"
                max="12"
                value={fDat.budget_month}
                onChange={(e) => setfDat({ ...fDat, budget_month: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={fDat.budget_year}
                onChange={(e) => setfDat({ ...fDat, budget_year: e.target.value })}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn-primary"
          >
            Create Budget
          </button>
        </form>
      )}

      {budgets.length===0? (
        <p className="empty-state">No budgets found. Add your first budget above.</p>
      ) : (
        <div>
          {budgets.map((budget) => {
            const category = categories.find(c =>c[0]===budget[2])
            const monthss = ['January', 'February','March', 'April','May', 'June', 'July', 'August', 'September', 'October','November','December']
            return (
              <div
                key={budget[0]}
                className="item-card"
              >
                {eId === budget[0] ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={fDat.category_id}
                        onChange={(e) => setfDat({ ...fDat, category_id: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat)=>(
                          <option key={cat[0]} value={cat[0]}>
                            {cat[1]} ({cat[2]})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount Limit</label>
                      <input
                        type="number"
                        value={fDat.amount_limit}
                        onChange={(e) => setfDat({ ...fDat, amount_limit: e.target.value })}
                        step="0.01"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Month</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={fDat.budget_month}
                          onChange={(e) => setfDat({ ...fDat, budget_month: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input
                          type="number"
                          min="2020"
                          max="2100"
                          value={fDat.budget_year}
                          onChange={(e) => setfDat({ ...fDat, budget_year: e.target.value })}
                        />
                      </div>
                    </div>
                    <div style={{ display:'flex',gap:'0.5rem',marginTop: '1rem' }}>
                      <button onClick={() =>handleUpdateBudget(budget[0])} className="btn-primary">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="item-header">
                    <div>
                      <h3 className="item-title">
                        {category ?category[1] :'Unknown Category'}
                      </h3>
                      <p className="item-subtitle">
                        {monthss[budget[4] - 1]} {budget[5]}
                      </p>
                    </div>
                    <div style={{ textAlign:'right'}}>
                      <p className="item-amount">
                        ${parseFloat(budget[3]).toFixed(2)}
                      </p>
                      <p className="item-label">Limit</p>
                      <div style={{ display:'flex',gap:'0.5rem',marginTop:'0.5rem',justifyContent:'flex-end' }}>
                        <button onClick={() =>startEdit(budget)} className="btn-small btn-primary">
                          Edit
                        </button>
                        <button onClick={() => deleteBudget(budget[0])} className="btn-small btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Budget
