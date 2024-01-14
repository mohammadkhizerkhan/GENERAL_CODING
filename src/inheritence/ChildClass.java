package inheritence;

public class ChildClass extends ParentClass{
    int s;

    public ChildClass(int s) {
        super(s,s);
        this.s = s;
    }

    public ChildClass(ParentClass mainObj, int s) {
        super(mainObj);
        this.s = s;
    }

    public ChildClass(ChildClass childObj){
        super(childObj);
        this.s = childObj.s;
    }

    public ChildClass(int a ,int b){
        super(a,b);
        this.s = -1;
    }

    public ChildClass(int i, int i1, int i2) {
        super(i,i1);
        this.s = i2;
    }
}
