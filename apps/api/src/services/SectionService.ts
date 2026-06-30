import { db, QueryDocumentSnapshot } from '../lib/firebase';
import { AppError } from '../types/AppError';
import { SectionType } from '@mirror/shared';

export class SectionService {
  /**
   * Fetch all sections for a user, sorted by order.
   */
  static async getSections(userId: string) {
    const snapshot = await db.collection('users').doc(userId).collection('sections').orderBy('order', 'asc').get();
    const sections: any[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      sections.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return sections;
  }

  /**
   * Add a new section for a user.
   */
  static async addSection(userId: string, type: SectionType, title: string, data: any) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new AppError(404, 'User not found');

    const sectionsSnapshot = await userRef.collection('sections').orderBy('order', 'desc').limit(1).get();
    let nextOrder = 0;
    if (!sectionsSnapshot.empty) {
      nextOrder = (sectionsSnapshot.docs[0].data().order || 0) + 1;
    }

    const newSectionRef = userRef.collection('sections').doc();
    const sectionPayload = {
      type,
      title,
      data: data || {},
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    await newSectionRef.set(sectionPayload);

    return {
      id: newSectionRef.id,
      ...sectionPayload,
    };
  }

  /**
   * Update an existing section.
   */
  static async updateSection(userId: string, sectionId: string, title?: string, data?: any) {
    const sectionRef = db.collection('users').doc(userId).collection('sections').doc(sectionId);
    const sectionDoc = await sectionRef.get();
    if (!sectionDoc.exists) throw new AppError(404, 'Section not found');

    const updatePayload: any = {};
    if (title !== undefined) updatePayload.title = title;
    if (data !== undefined) updatePayload.data = data;

    await sectionRef.update(updatePayload);

    const updatedDoc = await sectionRef.get();
    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };
  }

  /**
   * Delete a section.
   */
  static async deleteSection(userId: string, sectionId: string) {
    const sectionRef = db.collection('users').doc(userId).collection('sections').doc(sectionId);
    const sectionDoc = await sectionRef.get();
    if (!sectionDoc.exists) throw new AppError(404, 'Section not found');

    await sectionRef.delete();
    return { success: true };
  }

  /**
   * Reorder a list of sections.
   */
  static async reorderSections(userId: string, orderedIds: string[]) {
    const userRef = db.collection('users').doc(userId);
    const batch = db.batch();

    orderedIds.forEach((sectionId, index) => {
      const sectionRef = userRef.collection('sections').doc(sectionId);
      batch.update(sectionRef, { order: index });
    });

    await batch.commit();
    return { success: true };
  }
}
