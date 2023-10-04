import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "utils/formater";
import {MaterialReactTable} from 'material-react-table';
import courseApi from "api/courseApi";
const IMG_URL = "/courses/";

function CourseClient() {
  const [courses, setCourses] = useState([]);

  const columnsCourses = useMemo(
    () => [
      {
        accessorKey: "courseName",
        header: "Tên khóa học",
        size: 150,
      },
      {
        accessorKey: "courseDuration",
        header: "Thời lượng (h)",
        size: 75,
      },
      {
        accessorKey: "coursePrice",
        accessorFn: (row) => row,
        Cell: ({ cell }) => {
          const row = cell.getValue();
          return <span>{formatCurrency(row.coursePrice)}</span>;
        },
        header: "Học phí (đ)",
        size: 60,
      },
      {
        accessorKey: "subject.subjectName",
        header: "Tên môn học",
        size: 100,
      },
      {
        accessorKey: "subject.admin.fullname",
        header: "Mã người tạo",
        size: 80,
      },
    ],
    []
  );

  // lấy tất cả các khóa học
  const getAllCourseByAccountId = async () => {
    try {
      const resp = await courseApi.findCoursesByAccountId(4);
      setCourses(resp.reverse());
    } catch (error) {
      console.log("GetAllCourse", error);
    }
  };

  useEffect(() => {
    if (courses.length > 0) return;
    getAllCourseByAccountId();
  }, []);

  return (
    <>
      <div className="col-lg-12">
        <div className="mt-7">
          <div className="col-lg-12 bg-light p-3">
            <h4 className="text-info">
              <b>Khóa học đã đăng ký</b>
            </h4>
            <MaterialReactTable
              muiTableBodyProps={{
                sx: {
                  //stripe the rows, make odd rows a darker color
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                  },
                },
              }}
              enableColumnResizing
              enableGrouping
              enableStickyHeader
              enableStickyFooter
              enableRowNumbers
              // state={{isLoading: loadingCourses}}
              positionActionsColumn="last"
              columns={columnsCourses}
              data={courses}
              enableRowActions
              muiTablePaginationProps={{
                rowsPerPageOptions: [10, 20, 50, 100],
                showFirstButton: true,
                showLastButton: true,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseClient;
