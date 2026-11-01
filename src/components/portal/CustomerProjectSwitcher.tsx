import Link from "next/link";
import {
  DEMO_CUSTOMERS,
  DEMO_PROJECTS,
  getJob,
  getProjectForJob,
  type DemoJob,
} from "@/lib/portal/demo-data";

export function CustomerProjectSwitcher({
  job,
  role,
}: {
  job: DemoJob;
  role: "shop" | "shop-admin" | "superadmin" | "buyer";
}) {
  if (role === "buyer") return null;

  const currentProject = getProjectForJob(job);
  const currentCustomerId = currentProject?.customerId;

  return (
    <nav className="portal-customer-switch" aria-label="Switch customer or project">
      <p className="portal-customer-switch__label">Switch customer / project</p>
      <ul className="portal-customer-switch__list">
        {DEMO_CUSTOMERS.map((customer) => {
          const projects = DEMO_PROJECTS.filter((p) => p.customerId === customer.id);
          return (
            <li key={customer.id}>
              <strong>{customer.name}</strong>
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/customers/${customer.id}/projects/${project.id}`}
                      className={
                        customer.id === currentCustomerId && project.id === job.projectId
                          ? "is-current"
                          : undefined
                      }
                    >
                      {project.name}
                    </Link>
                    {" · "}
                    {project.jobIds.map((jobId, i) => {
                      const j = getJob(jobId);
                      return (
                        <span key={jobId}>
                          {i > 0 ? ", " : null}
                          <Link href={`/jobs/${jobId}`}>
                            {jobId === job.id ? `${j?.name ?? jobId} (here)` : (j?.name ?? jobId)}
                          </Link>
                        </span>
                      );
                    })}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
