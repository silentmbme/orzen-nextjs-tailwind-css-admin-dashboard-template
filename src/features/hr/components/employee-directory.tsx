"use client";
import { useState } from "react";
import { LayoutGrid, List, Plus, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { TablePagination } from "@/components/ui/table-pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrWorkspace } from "./hr-workspace";
import { HrTitle, HrStatus } from "./hr-ui";
import { EmployeeForm } from "./employee-form";
import { EmployeeDetails } from "./employee-details";
import { useHr } from "../hooks/use-hr";
import { deleteEmployee, employeeReferenced } from "../demo-service";
export function EmployeeDirectory() {
  const { data } = useHr(),
    [query, setQuery] = useState(""),
    [department, setDepartment] = useState("all"),
    [status, setStatus] = useState("all"),
    [grid, setGrid] = useState(false),
    [sort, setSort] = useState("name"),
    [page, setPage] = useState(0);
  const [editor, setEditor] = useState<string | null>(null),
    [selected, setSelected] = useState(""),
    [deleting, setDeleting] = useState(""),
    [error, setError] = useState("");
  const employees = data.employees.filter(
    (e) =>
      `${e.name} ${e.id} ${e.email}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (department === "all" || e.departmentId === department) &&
      (status === "all" || e.status === status),
  );
  const ordered = [...employees].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b.joined.localeCompare(a.joined),
    ),
    current = Math.min(page, Math.max(0, Math.ceil(employees.length / 6) - 1));
  const removed = data.employees.find((e) => e.id === deleting),
    referenced = employeeReferenced(data, deleting);
  function remove() {
    const error = deleteEmployee(deleting);
    if (error) setError(error);
    else setDeleting("");
  }
  return (
    <HrWorkspace
      title="Employees"
      description="A fictional employee directory with contact, reporting and employment context."
      actions={
        <Button onClick={() => setEditor("new")}>
          <Plus size={13} />
          Add employee
        </Button>
      }
    >
      <Card
        title={<HrTitle icon={UsersRound}>Employee directory</HrTitle>}
        action={
          <div className="flex gap-1">
            <Button
              variant={!grid ? "secondary" : "ghost"}
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              <List size={12} />
              List
            </Button>
            <Button
              variant={grid ? "secondary" : "ghost"}
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              <LayoutGrid size={12} />
              Grid
            </Button>
          </div>
        }
      >
        <div className="my-3 flex flex-wrap items-center gap-2">
          <Select
            aria-label="Employee department filter"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All departments</option>
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Employee status filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All employment states</option>
            {["Active", "Onboarding", "Inactive"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <span className="ml-auto text-tiny text-muted">{employees.length} employees</span>
        </div>
        {grid ? (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <Input
                aria-label="Search employee grid"
                placeholder="Search name, ID or email…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
              <Select
                aria-label="Sort employee grid"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Name A–Z</option>
                <option value="joined">Newest joins</option>
              </Select>
            </div>
            <div className="grid gap-widget sm:grid-cols-2 xl:grid-cols-3">
              {ordered.slice(current * 6, current * 6 + 6).map((employee) => (
                <Card key={employee.id}>
                  <div className="flex items-start justify-between gap-2">
                    <UserAvatar name={employee.name} size={44} />
                    <HrStatus status={employee.status} />
                  </div>
                  <button
                    className="mt-3 text-left text-body font-medium hover:text-accent"
                    onClick={() => setSelected(employee.id)}
                  >
                    {employee.name}
                  </button>
                  <p className="mt-1 text-label text-muted">{employee.designation}</p>
                  <p className="mt-2 text-tiny text-accent">
                    {data.departments.find((d) => d.id === employee.departmentId)?.name}
                  </p>
                  <p className="mt-3 break-all text-tiny text-muted">{employee.email}</p>
                  <div className="mt-3 flex justify-between gap-2 border-t border-border pt-2 text-tiny text-muted">
                    <span>{employee.type}</span>
                    <span>{employee.id}</span>
                  </div>
                  <div className="mt-3 flex justify-between gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelected(employee.id)}>
                      View profile
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditor(employee.id)}>
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            {!employees.length && <EmptyState>No matching employees.</EmptyState>}
            <TablePagination
              label="Employee grid"
              count={employees.length}
              currentPage={current}
              pageCount={Math.max(1, Math.ceil(employees.length / 6))}
              pageSize={6}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="[&_table]:min-w-[1080px]">
            <DataTable
              label="Employees"
              rows={employees}
              rowKey={(e) => e.id}
              pageSize={6}
              search={{ value: query, onChange: setQuery }}
              columns={[
                {
                  key: "name",
                  label: "Employee",
                  value: (e) => `${e.name} ${e.id} ${e.email}`,
                  render: (e) => (
                    <button
                      className="flex items-center gap-2 text-left"
                      onClick={() => setSelected(e.id)}
                    >
                      <UserAvatar name={e.name} size={30} />
                      <span>
                        <span className="block font-medium text-accent">{e.name}</span>
                        <span className="mt-1 block text-tiny text-muted">
                          {e.id} · {e.email}
                        </span>
                      </span>
                    </button>
                  ),
                },
                {
                  key: "department",
                  label: "Department",
                  value: (e) =>
                    data.departments.find((d) => d.id === e.departmentId)?.name || "Unknown",
                },
                {
                  key: "role",
                  label: "Designation / manager",
                  value: (e) => e.designation,
                  render: (e) => (
                    <span>
                      {e.designation}
                      <span className="mt-1 block text-tiny text-muted">
                        {data.employees.find((m) => m.id === e.managerId)?.name || "No manager"}
                      </span>
                    </span>
                  ),
                },
                { key: "joined", label: "Joined", value: (e) => e.joined },
                { key: "type", label: "Type", value: (e) => e.type },
                {
                  key: "status",
                  label: "Status",
                  value: (e) => e.status,
                  render: (e) => <HrStatus status={e.status} />,
                },
                {
                  key: "actions",
                  label: "Manage",
                  value: (e) => e.id,
                  render: (e) => (
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setEditor(e.id)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeleting(e.id);
                          setError("");
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Card>
      <Dialog
        open={editor !== null}
        title={editor === "new" ? "Add demo employee" : "Edit employee"}
        onClose={() => setEditor(null)}
      >
        {editor !== null && (
          <EmployeeForm
            key={editor}
            employee={data.employees.find((e) => e.id === editor)}
            onClose={() => setEditor(null)}
          />
        )}
      </Dialog>
      {selected && (
        <EmployeeDetails
          key={selected}
          id={selected}
          onClose={() => setSelected("")}
          onEdit={() => {
            setEditor(selected);
            setSelected("");
          }}
        />
      )}
      <Dialog open={!!removed} title="Delete demo employee" onClose={() => setDeleting("")}>
        {removed && (
          <div className="space-y-3">
            <p className="text-label">Delete {removed.name} and their local profile activity?</p>
            <p className="text-label text-muted">
              {referenced
                ? "This employee has attendance, leave, payroll, interview or reporting references. Keep the history and edit their employment status instead."
                : "This unreferenced demo record can be removed. This cannot be undone."}
            </p>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting("")}>
                Keep employee
              </Button>
              <Button variant="destructive" disabled={referenced} onClick={remove}>
                Confirm delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </HrWorkspace>
  );
}
